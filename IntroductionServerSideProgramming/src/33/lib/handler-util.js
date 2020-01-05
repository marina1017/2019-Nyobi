'use strict';
//ファビコンを表示させるため
const fs = require('fs');
//ファビコンのパスを探すため
var path = require('path');
//実行したnode.jsのパス
const pathstr = process.argv[1]

function handleLogout(req, res){
    res.writeHead(401, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    res.end('<!DOCTYPE html><html lang="ja"><body>' +
    '<h1>ログアウトしました</h1>' +
    '<a href="/posts">ログイン</a>' +
    '</body></html>'
    );
}

function handleNotFound(req, res) {
    res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('ページが見つかりません');
}

function handleBadRequest(req, res) {
    res.writeHead(400, {
        'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('未対応のリクエストです');
};

function handleFavicon(req, res){
    //image/vnd.microsoft.icon という ファビコンのコンテンツタイプをレスポンスヘッダに書き出しています。
    res.writeHead(200, {
        'Content-Type': 'image/vnd.microsoft.icon'
    });
    //ファビコンのファイルを Stream として同期的に読み出し、それをそのままレスポンスの内容として書き出しています。
    const favicon = fs.readFileSync(path.dirname(pathstr) +'/favicon.ico');
    res.end(favicon);
}

module.exports = {
    handleLogout,
    handleNotFound,
    handleBadRequest,
    handleFavicon
};