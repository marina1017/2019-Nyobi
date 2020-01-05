//見た目のデザインの変更
//ファビコンの追加　
//pugファイルの編集
// Bootstrap は、どのようなデバイスでも適切に表示されるデザインを提供してくれる Web ページ作成の部品集
// 1 つのページで、複数のデバイスに対応するページを実現するデザインをレスポンシブデザインという
// セキュリティ上の問題がある Web サービスを公開してはいけない

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