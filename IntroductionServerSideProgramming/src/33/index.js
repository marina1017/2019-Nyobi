//Hrokuへの公開
//Procfile を作成　16番目でやったようにする
//上の階層にあるprocfileを変更　ルートのpackage.jsonを修正

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

//const port = 8000;
//Herokuにデプロイするため下記の設定が必要( Heroku で起動する際は Heroku の環境変数が指定するポートを利用)
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.info('Listening on' + port);
});