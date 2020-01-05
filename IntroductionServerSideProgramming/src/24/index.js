//データベースへの保存機能の実装
//macにPostgreSQLを導入した
//インストール時に postgres データベースは出来てるので、とりあえずそこにつないでみる。
// $psql postgres
// #\du
//Role name |                         Attributes                         | Member of
//-----------+------------------------------------------------------------+-----------
//marina    | Superuser, Create role, Create DB, Replication, Bypass RLS | {}

//ユーザーを増やす postgresという名前でつくる
//# create user postgres;
//Role name |                         Attributes                         | Member of
//-----------+------------------------------------------------------------+-----------
//marina    | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
//postgres  |                                                            | {}

//postgresユーザーにパスワードを指定する
//# \password postgres（エンターキー）

//新しく作ったユーザーに権限を付与する
//postgres=# ALTER ROLE postgres WITH SUPERUSER CREATEDB CREATEROLE;
//\du
//Role name |                         Attributes                         | Member of
//----------+------------------------------------------------------------+-----------
//marina    | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
//postgres  | Superuser, Create role, Create DB                          | {}

//データベースを作成してターミナルを戻す
//#create database secret_board;
//#\q

//データモデリング
//投稿内容
//投稿したユーザー名
//トラッキングCookieの内容
//作成日時

//データベースにデータが入っているかを確認
//psql postgres
//# \c secret_board
//# select * fro id | content  | postedBy | trackingCookie |         createdAt          |         updatedAt
//----+----------+----------+----------------+----------------------------+----------------------------
//1 | testtest | admin    |                | 2020-01-04 00:53:42.338+09 | 2020-01-04 00:53:42.338+09m "Post";

//もしもデータベースを壊してしまったらデータベースを削除し、再作成する
//$drop database secret_board;
//$create database secret_board;

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