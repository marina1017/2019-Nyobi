'use strict';
const pug = require('pug');
const contents = [];
//パスが無いと言われたので自分で探す
const fs = require('fs');
var path = require('path');

//定義されていないメソッド名がきたら400番を返すようにする実装で使っている
const util = require('./handler-util');

function handle(req, res) {
    switch (req.method) {
        case 'GET':
            //実行したnode.jsのパス
            const pathstr = process.argv[1]

            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            //パスの先が無いけどといわれたので修正した
            //配列のcontensに内容を入れているので、配列を contents というプロパティ名でテンプレートに渡します。
            res.end(pug.renderFile( path.dirname(pathstr) + '/views/posts.pug', {contents: contents}));
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
                contents.push(content);
                console.info('投稿された全内容:'+ contents)
                handleRedirectPosts(req, res);
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
