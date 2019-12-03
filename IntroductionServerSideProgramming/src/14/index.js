'use strict';
const http = require('http');
//ドキュメント　http.createServer(requestListener);
//https://www.w3schools.com/nodejs/met_http_createserver.asp

//requestListener
//https://www.w3schools.com/nodejs/func_http_requestlistener.asp
//無名関数は、サーバーにリクエストがあった際に呼び出されます。
//HTTP サーバーがイベントを発行する存在として 作られているため
const server = http.createServer((req, res) => {
    //req.connection.remoteAddress 接続元のIPアドレスを取得できる
    //console.info 情報のログをコンソールに出力する関数
    /**
     * メモ
     * info:情報。普段から残しておきたい情報に使う。 標準出力
     * warn:警告。問題となる可能性がある情報に使う。 エラー標準出力
     * error:エラー。直ちに対応が必要な情報に使う。 エラー標準出力
     */
    console.info('[' + new Date() + '] Requested by ' + req.connection.remoteAddress);

    //writeHead(statusCode: number, reasonPhrase?: string, headers?: OutgoingHttpHeaders): ServerResponse
    //内容の形式 Content-Type が、text/plain という通常のテキストであるという情報
    //文字セット charset が utf-8 であるという情報
    res.writeHead(200, {
        'content-Type': 'text/plain; charset=utf-8'
    });
    //res オブジェクトの、 write 関数は HTTP のレスポンスの内容を書き出します。
    res.write(req.headers['user-agent']);

    //res オブジェクトの、 write 関数は HTTP のレスポンスの内容を書き出します。
    res.write(req.headers['user-agent']);
    console.info('/////通ってる？////');
    // メソッドによって分岐させている
    switch (req.method) {
        case 'GET':
            res.write('GET ' + req.url);
            console.info('/////GET/////');
            break;
        case 'POST':
            res.write('POST '+ req.url);
            let rawData = '';
            req.on('data', (chunk) => {
                rawData = rawData + chunk;
            }).on('end', () => {
                console.info('[' + now + '] Data posted: ' + rawData);
            });
            console.info('/////POST/////');
            break;
        case 'DELETE':
            res.write('DELETE' + req.url);
            break;
        default:
            console.info('//////////');
            break;
    };

    //リクエストヘッダの user-agent の中身を、レスポンスの内容として書き出しています。
    res.end();
}).on('error', (e) => {
    console.error('['+ new Date() + '] Server Error', e);
}).on('clientError', (e) => {
    console.error('['+ new Date() + '] Server Error', e);
});

const port = 8000;
//最後のこのコードは、この HTTP が起動するポートを宣言し、
// そしてサーバーを起動して、起動した際に実行する関数を渡しています。
//listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): Server
server.listen(port, () => {
    console.info('listening on' + new Date() + port);
});