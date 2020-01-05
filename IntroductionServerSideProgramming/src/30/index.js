//セッション固定化攻撃脆弱性の対策
//リクエストで送られた Cookie の値の「元々のトラッキング ID 」と 「元々のトラッキング ID とユーザー名を結合したもののハッシュ値」を分離する
//「元々のトラッキング ID 」と「ユーザー名」を結合した文字列をつくる
//結合した文字列をハッシュ関数にかけて、ハッシュ値を得る
//「送られてきたハッシュ値」と「サーバー上で生成したハッシュ値」が同じであるかを検証する
//もし偽装されたものであれば、ハッシュ値が異なったり、または付与されていないものとなる

//まとめ
//セッションとは、システムにログインまたは接続してから、ログアウトまたは切断するまでの一連の操作や通信のこと
//セッション固定化攻撃とは、外部から指定可能なセッションの識別子を利用して他人のセッションをのっとること
//セッションの ID などに、生成方法が予測しにくいハッシュ値を加えることでセッション ID の正当性をチェックすることができる

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