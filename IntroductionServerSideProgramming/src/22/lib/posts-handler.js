'use strict';
const pug = require('pug');

//パスが無いと言われたので自分で探す
const fs = require('fs');
var path = require('path');

//定義されていないメソッド名がきたら400番を返すようにする実装で使っている
const util = require('./handler-util');

//データベースに保存するように実装する
const Post = require('./post');

function handle(req, res) {
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
                res.end(pug.renderFile( path.dirname(pathstr) + '/views/posts.pug',{
                    posts: posts
                }));
            });
            break;
        
        //投稿された情報をログに書きだして、 そのあと投稿フォームにリダイレクトしてみる
        case 'POST':
            let body = [];
            //リクエストで data と end という名前のデータを受け取ったイベントが生じた時の処理の実装
            req.on('data', (chunk) => {
                console.log("/////dateはいつ///////")
                body.push(chunk);

            }).on('end', () =>{
                body = Buffer.concat(body).toString();
                const decoded = decodeURIComponent(body);
                const content = decoded.split('content=')[1];
                console.info('投稿されました: ' + content);
                Post.create({
                    content: content,
                    //Cookie はまだ未実装なので trackingCookie は null
                    trackingCookie: null,
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

function handleRedirectPosts(req, res) {
    //同じパス名の POST メソッドから GET メソッドに転送する際には 303 - See Other のステータスコードを利用する
    res.writeHead(303, {
        'Location': '/posts'
    });
    res.end();
}

module.exports = {
    handle
};
