//Hrokuへの公開
//Procfile を作成　16番目でやったようにする
//上の階層にあるprocfileを変更　ルートのpackage.jsonを修正

//Herokuにログイン
//heroku login -i

//Heroku のサーバーを作成
//heroku create
//https://warm-island-46092.herokuapp.com/ | https://git.heroku.com/warm-island-46092.git

//Heroku で利用する PostgreSQL のデータベースを作成 Heroku 上に開発用の簡易的な PostgreSQL のデータベースを作成
//heroku addons:create heroku-postgresql:hobby-dev

/*このようなメッセージがでた
Creating heroku-postgresql:hobby-dev on ⬢ xxxxxxxxx-xxxxxxx-xxxxxx... free
Database has been created and is available
 ! This database is empty. If upgrading, you can transfer
 ! data from another database with pg:copy
Created postgresql-defined-76257 as DATABASE_URL
Use heroku addons:docs heroku-postgresql to view documentation
*/

//Herokuにデプロイ
//git push heroku master

//htttpでのアクセスを禁止する




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