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

                
                

                //pugにデータを渡す
                res.end(pug.renderFile( path.dirname(pathstr) + '/views/posts.pug',{
                    posts: posts,
                    user: req.user
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
                const decoded = decodeURIComponent(body);
                const content = decoded.split('content=')[1];
                console.info('投稿されました: ' + content);
                Post.create({
                    content: content,
                    //トラッキング ID をデータベースへの書き込み時に保存し、それを投稿一覧で表示させてみる
                    trackingCookie: trackingId,
                    //投稿したユーザー名を req.user で取得して postedBy に設定
                    postedBy: req.user
                }).then(() => {
                    ///postsにリダイレクトする
                    handleRedirectPosts(req, res);
                });
                
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
    switch (req.method) {
        case 'POST':
            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                //POST のデータを受け取り URI エンコードをデコードして、投稿の ID を取得
                body = Buffer.concat(body).toString();
                const decoded = decodeURIComponent(body);
                const id = decoded.split('id=')[1];
                // ID を使って投稿を取得 取得ができたら、then(...) の中に登録された無名関数が呼ばれ取得した投稿内容が post に入る
                Post.findByPk(id).then((post) => {
                    //投稿を行ったユーザー本人が削除を実行しようとしていることを if 文でチェック
                    if (req.user === post.postedBy ||req.user === 'admin') {
                        //問題なければ、 destroy 関数を使って削除し、リダイレクト
                        post.destroy().then(() => {
                            //閲覧情報をサーバーのログに残す
                            console.info(
                            `削除されました: user: ${req.user}, ` +
                            `remoteAddress: ${req.connection.remoteAddress},` +
                            `userAgent: ${req.headers['user-agent']}`
                            );
                            handleRedirectPosts(req, res);
                        });
                    }
                });
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
        //Math.random 関数は、 0 以上 1 未満のランダムな小数を返すので、それに 整数の最大値をかけ、Math.floor 関数で小数点以下を切り捨てています。
        const originalId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
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

function createValidHash(originalId, userName){
    // SHA-1 アルゴリズムを利用して、 元々のトラッキング ID とユーザー名を結合した 文字列に対してメッセージダイジェストを作成
    const sha1sum = crypto.createHash('sha1');
    sha1sum.update(originalId + userName);
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
