'use strict';
//require でのパスの指定方法が変わったのは、router.js から見ると posts-handler.js は同じディレクトリに存在するからです。
//require では require を書いたモジュール自身を基準として相対パスを指定します。
const postsHandler = require('./posts-handler');
const util = require('./handler-util');

function route(req, res){
    //process.env.DATABASE_URL という環境変数がある場合、 つまり本番のデータベースが存在している Heroku 環境であり、
    //かつ、 x-forwarded-proto というヘッダの値が http であるときのみ真となる
    //x-forwarded-proto ヘッダには、 Heroku が Node.js のアプリケーションに対して
    //内部的にリクエストを受け渡す際にアクセスで利用されたプロトコルが含まれています。
    if (process.env.DATABASE_URL
        && req.headers['x-forwarded-proto'] === 'http'){
            util.handleNotFound(req, res);
        }
    switch (req.url) {
        case '/posts':
            postsHandler.handle(req, res);
            break;
        case '/favicon.ico':
            util.handleFavicon(req,res);
            break;
        case '/posts?delete=1':
            console.info("routerはとおっている？");
            postsHandler.handleDelete(req,res);
            break;
        case '/logout':
            //TODO　ログアウト処理
            util.handleLogout(req, res);
            break;
        default:
            util.handleNotFound(req, res);
            break;
    }
}

module.exports = {
    route
};