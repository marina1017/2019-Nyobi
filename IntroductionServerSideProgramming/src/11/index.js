'use strict';
const http = require('http');
//ドキュメント　http.createServer(requestListener);
//https://www.w3schools.com/nodejs/met_http_createserver.asp

//requestListener
//https://www.w3schools.com/nodejs/func_http_requestlistener.asp
//無名関数は、サーバーにリクエストがあった際に呼び出されます。
const server = http.createServer((req, res) => {
    //writeHead(statusCode: number, reasonPhrase?: string, headers?: OutgoingHttpHeaders): ServerResponse
    //内容の形式 Content-Type が、text/plain という通常のテキストであるという情報
    //文字セット charset が utf-8 であるという情報
    res.writeHead(200, {
        'content-Type': 'text/html; charset=utf-8'
    });
    //res オブジェクトの、 write 関数は HTTP のレスポンスの内容を書き出します。
    //res.write(req.headers['user-agent']);
    res.write('<!DOCTYPE html><html lang="ja"><body><h1>HTMLの一番大きい見出しを表示します</h1></body></html>');
    //リクエストヘッダの user-agent の中身を、レスポンスの内容として書き出しています。
    res.end()
});

const port = 8000;
//最後のこのコードは、この HTTP が起動するポートを宣言し、
// そしてサーバーを起動して、起動した際に実行する関数を渡しています。
//listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): Server
server.listen(port, () => {
    console.log('listening on' + port);
});