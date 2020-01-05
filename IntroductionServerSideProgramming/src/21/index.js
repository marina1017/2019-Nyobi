//認証された投稿の一覧表示機能
//pwを平文で保存してはいけない
//ログアウト機能を作ってみる
//テンプレートエンジンは、配列のようなコレクションを渡すことで、 繰り返し出力できる機能を持ち合わせています。

//まとめ
//ID とパスワードを暗号化せずに管理することにはセキュリティ上の問題がある
//ページがみつからない場合には 404 - File Not Found というステータスコードを返す
//テンプレートエンジン pug は each-in という構文を用いて、繰り返してテンプレート出力することができる


'use strict';
const http = require('http');
const auth = require('http-auth');
const router = require('./lib/router');

//ファイルを読み込むのにパスを取得する
var path = require('path');
//実行したnode.jsのパス
const pathstr = process.argv[1]

const basic = auth.basic({
    realm: 'Enter username and password',
    file: path.dirname(pathstr) + '/users.htpasswd'
})

const server = http.createServer(basic, (req, res) => {
    //必要なリクエストの振り分け処理を行ってくれる
    router.route(req, res);
}).on('error', (e) => {
    console.error('Server Error', e);
}).on('clientError', (e) => {
    console.error('Client Error', e);
});

const port = 8000;
server.listen(port, () => {
    console.info('Listening on' + port);
});