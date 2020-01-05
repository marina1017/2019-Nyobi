//フォームによる投稿機能の実装
//モジュールを分ける

'use strict';
const http = require('http');
const router = require('./lib/router');

const server = http.createServer((req, res) => {
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