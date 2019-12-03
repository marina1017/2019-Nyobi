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
    const now = new Date()
    console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);

    //writeHead(statusCode: number, reasonPhrase?: string, headers?: OutgoingHttpHeaders): ServerResponse
    //内容の形式 Content-Type が、text/plain という通常のテキストであるという情報
    //文字セット charset が utf-8 であるという情報
    res.writeHead(200, {
        'content-Type': 'text/html; charset=utf-8'
    });
    
    // メソッドによって分岐させている
    //GETでアクセスした時にアンケートフォームを表示させる
    switch (req.method) {
        case 'GET':
            res.write('GET ' + req.url);
            const fs = require('fs');
            var path = require('path');
            //実行したnode.jsのパス
            const pathstr = process.argv[1]
            console.log("////////////")
            console.log(path.dirname(pathstr))
            console.log("////////////")
            // // カレントディレクトリ
            // const path_cureent = process.cwd();
            // // ファイル名の一覧
            // const filenames = fs.readdirSync(path);
            // console.log(filenames);

            const rs = fs.createReadStream(path.dirname(pathstr) + '/form.html');
            //const rs = fs.createReadStream('./form.html');
            //パイプをしている
            //Node.js では Stream の形式のデータは、読み込み用の Stream と書き込み用の Stream を繋いで そのままデータを受け渡すことができる。 
            //その関数が pipe という関数の機能
            //HTTP のレスポンスのコンテンツとしてファイルの内容をそのまま 返す。
            rs.pipe(res);
            break;

        case 'POST':
            let rawData = '';
            req.on('data', (chunk) => {
                rawData = rawData + chunk;
            }).on('end', () => {
                const decoded = decodeURIComponent(rawData);
                console.info('[' + now + '] 投稿:' + decoded);
                res.write('<!DOCTYPE html> <html lang="ja"><body><h1>' + decoded + 'が投稿されました</h1></body></html>');
                //POST メソッドを使った場合のみ res.end を行うようにする
                res.end();
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