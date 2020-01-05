'use strict';
//require でのパスの指定方法が変わったのは、router.js から見ると posts-handler.js は同じディレクトリに存在するからです。
//require では require を書いたモジュール自身を基準として相対パスを指定します。
const postsHandler = require('./posts-handler');
const util = require('./handler-util');

function route(req, res){
    switch (req.url) {
        case '/posts':
            postsHandler.handle(req, res);
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