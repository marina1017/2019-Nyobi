'use strict';
const pug = require('pug');

//パスが無いと言われたので自分で探す
const fs = require('fs');
var path = require('path');

//定義されていないメソッド名がきたら400番を返すようにする実装で使っている
const util = require('./handler-util');

//データベースに保存するように実装する
const Post = require('./post');

//クッキーで追跡できるようにする
const Cookies = require('cookies');

//日時を日本語に変換する
const moment = require('moment-timezone');

//トラッキングIをつねにけんしょうできるようにする
//Node.js の crypto モジュールを読み込んでいます。
const crypto = require('crypto');

//ワンタイムトークンを実装する
const oneTimeTokenMap = new Map(); // キーをユーザー名、値をトークンとする連想配列


const trackingIdKey = 'tracking_id';

function handle(req, res) {
     const cookies = new Cookies(req, res);
     //トラッキングIDを検証する
     //これは、addTrackingCookie ではトラッキング ID を検証した結果、 新しいトラッキング ID を再度付与する可能性があるため、
     // Cookie から直接取得した値ではなく、 検証され付与された ID をこの後のコードでも利用するようにするためです。
     const trackingId = addTrackingCookie(cookies, req.user);
    switch (req.method) {
        case 'GET':
            //実行したnode.jsのパス
            const pathstr = process.argv[1]

            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            //パスの先が無いけどといわれたので修正した
            //データベースからpostsを取り出す
            Post.findAll({order:[['id', 'DESC']]}).then((posts) => {
                
                posts.forEach((post) => {
                    //半角スペースを入力すると、 + に置換されるのを解決する
                    post.content = post.content.replace(/\+/g, ' ');
                    //日時を日本語に変換する
                    post.formattedCreatedAt = moment(post.createdAt).tz('Asia/Tokyo').format('YYYY年MM月DD日 HH時mm分ss秒');
                });

                //ワンタイムトークンを作成　crypto モジュールの randomBytes を利用して、推測されにくい ランダムなバイト列を作成し、それを 16 進数にした文字列を取得しています。
                const oneTimeToken = crypto.randomBytes(8).toString('hex');
                //ユーザー名をキーとして連想配列にこのトークンを保存
                oneTimeTokenMap.set(req.user, oneTimeToken);

                //pugにデータを渡す
                res.end(pug.renderFile( path.dirname(pathstr) + '/views/posts.pug',{
                    posts: posts,
                    user: req.user,
                    oneTimeToken: oneTimeToken
                }));
                //閲覧情報をサーバーのログに残す
                console.info(
                    `閲覧されました: user: ${req.user}, ` +
                    `trackingId: ${trackingId},` +
                    `remoteAddress: ${req.connection.remoteAddress},` +
                    `userAgent: ${req.headers['user-agent']}`
                );
            });
            break;
        
        //投稿された情報をログに書きだして、 そのあと投稿フォームにリダイレクトしてみる
        case 'POST':
            let body = [];
            //リクエストで data と end という名前のデータを受け取ったイベントが生じた時の処理の実装
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () =>{
                body = Buffer.concat(body).toString();
                //decoded の中身は、content=投稿内容&oneTimeToken=トークン本体 のようになっています
                const decoded = decodeURIComponent(body);
                //受け取ったデータを、 & で分割した後、
                const dataArray = decoded.split('&');
                //投稿内容とリクエストで送られたワンタイムトークンを取得しています。 
                const content = dataArray[0] ? dataArray[0].split('content=')[1] : '';
                const requestedOneTimeToken = dataArray[1] ? dataArray[1].split('oneTimeToken=')[1] : '';

                //連想配列に格納されているワンタイムトークンとリクエストされたワンタイム トークンが同じ場合のみ投稿をデータベースに保存する処理をおこなう
                if (oneTimeTokenMap.get(req.user) === requestedOneTimeToken) {
                    console.info('投稿されました' + content);
                    Post.create({
                        content: content,
                        //トラッキング ID をデータベースへの書き込み時に保存し、それを投稿一覧で表示させてみる
                        trackingCookie: trackingId,
                        //投稿したユーザー名を req.user で取得して postedBy に設定
                        postedBy: req.user
                    }).then(() => {
                        //そして投稿が成功した後に、連想配列 oneTimeTokenMap の delete 関数を利用して、 利用済みのトークンを連想配列から除去
                        oneTimeTokenMap.delete(req, res);
                        ///postsにリダイレクトする
                        handleRedirectPosts(req, res);
                    });
                } else {
                    ///以上の処理によりトークンが正しくない場合に、 400 - Bad Request のステータスコードを返す
                    util.handleBadRequest(req, res);
                }
            })
            break;
        default:
            //定義されていないメソッド名がきたら400番を返すようにする実装で使っている
            util.handleBadRequest(req,res);
            break;
    }
}

//投稿を削除する処理
function handleDelete(req, res) {
    console.info("ここです");
    switch (req.method) {
        case 'POST':
            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                console.info("ここです");
                //POST のデータを受け取り URI エンコードをデコードして、投稿の ID を取得
                body = Buffer.concat(body).toString();
                const decoded = decodeURIComponent(body);

                const dataArray = decoded.split('&');
                //pugで設定したnameの名前で分割している
                const id = dataArray[0] ? dataArray[0].split('id=')[1] : '';
                const requestedOneTimeToken = dataArray[1] ? dataArray[1].split('oneTimeToken=')[1] : '';
                //記録していたトークンと一致しなければ削除の処理をしない
                console.log("oneTimeTokenMap.get(req.user)",oneTimeTokenMap.get(req.user))
                console.log("requestedOneTimeToken",requestedOneTimeToken)
                if (oneTimeTokenMap.get(req.user) === requestedOneTimeToken){
                    Post.findByPk(id).then((post) => {
                        if (req.user === post.postedBy || req.user === 'admin') {
                            post.destroy().then(() => {
                                console.info(
                                    '削除されました: user: ${req.user},' +
                                    `remoteAddress: ${req.connection.remoteAddress},` +
                                    `userAgent: ${req.headers['user-agent']}`
                                );
                                oneTimeTokenMap.delete(req.user);
                                handleRedirectPosts(req, res);
                            });
                        }
                    });
                } else {
                    util.handleBadRequest(req, res);
                }
            });
            break;
        default:
            util.handleBadRequest(req, res);
            break;
    }
}

/**
* Cookieに含まれているトラッキングIDに異常がなければその値を返し、
* 存在しない場合や異常なものである場合には、再度作成しCookieに付与してその値を返す
* @param {Cookies} cookies
* @param {String} userName
* @return {String} トラッキングID
*/
function addTrackingCookie(cookies, userName){
    //Cookie からリクエストに含まれたトラッキング ID を取得
    const requestedTrackingId = cookies.get(trackingIdKey);
    //isValidTrackingId という関数で、リクエストされたトラッキング ID が ユーザー名のものとして正しいものであるのかを検証
    if (isValidTrackingId(requestedTrackingId, userName)){
        return requestedTrackingId;
    } else {
        //リクエストで送られたトラッキング ID がない場合や、不正な場合の時の処理
        //これを推測されにくい安全なランダム値のものに変更。
        const originalId = parseInt(crypto.randomBytes(8).toString('hex'), 16);
        //その値に 1 日分のミリ秒 1000 * 60 * 60 * 24 を足すことで、 1 日後を示すミリ秒が計算できます。
        const tomorrow = new Date(Date.now() + (1000* 60 * 60*24));
        //trackingId は、「元々の ID」と「元の ID とユーザー名を利用して 作られたハッシュ値」を組み合わせた値としています。
        const trackingId = originalId + '_' + createValidHash(originalId, userName);
        //以上のコードは、定数 trackingIdKey で指定された名前で トラッキング ID の Cookie を設定し、 
        //オプションのオブジェクトとして、24 時間後の明日に有効期限が切れるように、先ほど作った Date オブジェクト tomorrow を渡しています。
        cookies.set(trackingIdKey, trackingId, {expires: tomorrow});
        return trackingId;
    }
}

function isValidTrackingId(trackingId, userName) {
    //trackingId の値が null や undefined のような falsy な値である場合は、 正当ではないということで false を返しています。
    if (!trackingId) {
        return false;
    }
    //trackingId を _ で分割
    const splitted = trackingId.split('_');
    const originalId = splitted[0];
    const requestedHash = splitted[1];
    return createValidHash(originalId, userName) === requestedHash;
}

const secretKey =
'5a69bb55532235125986a0df24aca759f69bae045c7a66d6e2bc4652e3efb43da4' +
'd1256ca5ac705b9cf0eb2c6abb4adb78cba82f20596985c5216647ec218e84905a' +
'9f668a6d3090653b3be84d46a7a4578194764d8306541c0411cb23fbdbd611b5e0' +
'cd8fca86980a91d68dc05a3ac5fb52f16b33a6f3260c5a5eb88ffaee07774fe2c0' +
'825c42fbba7c909e937a9f947d90ded280bb18f5b43659d6fa0521dbc72ecc9b4b' +
'a7d958360c810dbd94bbfcfd80d0966e90906df302a870cdbffe655145cc4155a2' +
'0d0d019b67899a912e0892630c0386829aa2c1f1237bf4f63d73711117410c2fc5' +
'0c1472e87ecd6844d0805cd97c0ea8bbfbda507293beebc5d9';


function createValidHash(originalId, userName){
    // SHA-1 アルゴリズムを利用して、 元々のトラッキング ID とユーザー名を結合した 文字列に対してメッセージダイジェストを作成
    const sha1sum = crypto.createHash('sha1');
    sha1sum.update(originalId + userName + secretKey);
    //最終的にそのメッセージダイジェストを、 16 進数の文字列として取得
    return sha1sum.digest('hex');
}

function handleRedirectPosts(req, res) {
    //同じパス名の POST メソッドから GET メソッドに転送する際には 303 - See Other のステータスコードを利用する
    res.writeHead(303, {
        'Location': '/posts'
    });
    res.end();
}

module.exports = {
    handle,
    handleDelete
};
