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


const trackingIdKey = 'tracking_id';

function handle(req, res) {
     const cookies = new Cookies(req, res);
     addTrackingCookie(cookies);
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
                    `trackingId: ${cookies.get(trackingIdKey)},` +
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
                    trackingCookie: cookies.get(trackingIdKey),
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

//クッキーで追跡できるようにする時に作った関数
function addTrackingCookie(cookies){
    //get 関数で取得された値が undefined や null などの falsy な値であるとき true となる式です。
    if (!cookies.get(trackingIdKey)) {
        //Math.random 関数は、 0 以上 1 未満のランダムな小数を返すので、それに 整数の最大値をかけ、Math.floor 関数で小数点以下を切り捨てています。
        const trackingId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        //その値に 1 日分のミリ秒 1000 * 60 * 60 * 24 を足すことで、 1 日後を示すミリ秒が計算できます。
        const tommorrow = new Date(Date.now() + (1000*60*60*24));
        //以上のコードは、定数 trackingIdKey で指定された名前で トラッキング ID の Cookie を設定し、 オプションのオブジェクトとして、24 時間後の明日に有効期限が切れるように、先ほど作った Date オブジェクト tomorrow を渡しています。
        cookies.set(trackingIdKey, trackingId, {expires: tommorrow})
    }
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
