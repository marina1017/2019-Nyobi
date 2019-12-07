//Herokuを使ってHerokuにデプロイする
/**
 * やったこと
 * herokuをbrewでいれた
 * heroku　CLIでログインした
 * heroku login -i
 * 
 * //herokuのリポジトリ的なやつをつくる
 * heroku create
 * 
 * //さくせいしたやつ
 * blooming-reaches-35188
 * 
 * //herokuの実行に必要なProcfileを作成
 * echo "web: node index.js" > Procfile
 * 
 * //gitでherokuに向き先をかえた
 * git remote -vでかくにんできる
 * 
 * //herokuデプロイ
 * git push heroku master:master
 */


'use strict';
const http = require('http');
//putテンプレートエンジンを使う
const pug = require('pug');
//ドキュメント　http.createServer(requestListener);
//https://www.w3schools.com/nodejs/met_http_createserver.asp

console.log("//////////////")
console.log(http)
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
            var path = require('path');
            //実行したnode.jsのパス
            const pathstr = process.argv[1]
            //第2引数にオプションをつけることができる
            if (req.url === '/enquetes/yaki-shabu') {
                
                res.write(pug.renderFile(path.dirname(pathstr) + '/form.pug',{
                    path: req.url,
                    firstItem: '焼き肉',
                    secondItem: 'しゃぶしゃぶ'
                }));
            } else if (req.url === '/enquetes/rice-bread') {

                res.write(pug.renderFile(path.dirname(pathstr) + '/form.pug', {
                    path: req.url,
                    firstItem: 'ご飯',
                    secondItem: 'ぱん'
                }));
            } else if (req.url === '/enquetes/sushi-pizza') {

                res.write(pug.renderFile(path.dirname(pathstr) + '/form.pug', {
                    path: req.url,
                    firstItem: 'すし',
                    secondItem: 'ぴざ'
                }));
            }
            
            res.end();
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

const port = process.env.PORT || 8000;
//最後のこのコードは、この HTTP が起動するポートを宣言し、
// そしてサーバーを起動して、起動した際に実行する関数を渡しています。
//listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): Server
server.listen(port, () => {
    console.info('listening on' + new Date() + port);
});