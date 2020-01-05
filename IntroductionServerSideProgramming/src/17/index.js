//認証で利用者を制限する
/**
 * やったこと
 * ##準備
 * yarnでhttp-authのライブラリをインストール
 * 認証するためにcreateServerする時に第一引数にbasicをいれている
 * 
 * ##Base64をつかって認証をする
 * そして Chrome のデベロッパーツールを開いて、 Network タブを開いたうえで 再度、アンケートのページを再読込してください。
 * その後、 Network タブに表示された yaki-shabu という項目をクリックして、 右側に表示される Headers タブから、 Request Headers という項目を確認します。
 * Authorization:Basic Z3Vlc3Q6eGFYWkpRbUU=と表示されている
 * 
 * ##Base64でエンコードされた文字の解読
 * atob('Z3Vlc3Q6eGFYWkpRbUU=')
 * →"guest:xaXZJQmE"という文字列になる
 * 
 * ##ログアウト用の URL を作成する
 * /logout にアクセスした際にログアウトされるようにしてみましょう。
 * 
 * # まとめ
 * 認証とは、コンピューターの利用者の正当性を検証すること
 * Basic 認証を暗号化されていない HTTP 上で使用すると、 ID やパスワードが漏 ろう洩 えい・改竄される可能性がある
 * Basic 認証は HTTP の Authorization ヘッダを利用して行われる
 */


'use strict';
const http = require('http');
//putテンプレートエンジンを使う
const pug = require('pug');
//ドキュメント　http.createServer(requestListener);
//https://www.w3schools.com/nodejs/met_http_createserver.asp

const auth = require('http-auth');
//引数はオブジェクトと無名関数を渡している
const basic = auth.basic(
    //オブジェクトの realm プロパティには、Basic 認証時に保護する領域を規定する文字列をいれている
    { realm: 'Enauetes Area.'},
    (username, password, callback) => {
        callback(username === 'guest' && password === 'xaXZJQmE');

});

//http.createServer の第一引数に basic オブジェクトを渡して Basic 認証に対応させて server のオブジェクトを作成する
const server = http.createServer(basic,(req, res) => {
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

    ///logout にアクセスした際にログアウトされるようにする
    ///logout である時には、ステータスコード 401 - Unauthorized を返す処理
    if (req.url === '/logout') {
        //writeHead(statusCode: number, reasonPhrase?: string, headers?: OutgoingHttpHeaders): ServerResponse
        res.writeHead(401, {
            'Content-Type': 'text/plain; charset=utf-8'
        });
        res.end('ログアウトしました');
        return
    }

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