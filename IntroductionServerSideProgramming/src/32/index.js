//CSRF脆弱性の対策
//index.htmlから知らずにボタンを押すと意図とはことなり投稿されてしまうという脆弱性に対して対応する

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