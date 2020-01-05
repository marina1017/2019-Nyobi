//より堅牢なセッション管理
//このようなセッションの脆弱性に対応するための一番簡単な方法としては、 安全なセッション管理を提供している Web のフレームワークを利用するというものがあります。
//セッションの識別子を推測されにくいものにする
//セッションの識別子を URL のパラメーターにいれない
//HTTPS 通信で利用する Cookie には secure 属性を設定する
//ログインが成功したら新しいセッションの識別子を発行する

//まとめ
//セッションの識別子を推測されにくいものにする
//秘密鍵を結合したハッシュ値を利用して、推測をより困難にすることができる
//セッション管理の実装は難しいため、可能であればフレームワークを利用する

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