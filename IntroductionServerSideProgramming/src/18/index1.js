// Cookieをつかった秘密の匿名掲示板
//　HTTP サーバーを記述する
// デベロッパーツールを起動し、 Application というタブを開き、 左のツリーから、 Cookies という項目をクリックして、その内部の localhost という要素を クリックします。
// Cookie を使うとブラウザに情報を保存できる
// Cookie には、有効期限を設定できる
// Cookie は、 Cookie と Set-Cookie という 2 つの HTTP ヘッダ項目を使用して実現される


'use strict';
const http = require('http');
//createServer(requestListener?: RequestListener): Server
const server = http.createServer((req,res) => {
    const now = Date.now();
    //クッキーの有効期限を設定する
    res.setHeader('Set-Cookie', 'last_access=' + now + ';expires=Mon, 07 Jan 2036 00:00:00 GMT;');
    //クッキーの中身を表示する
    //res.end(req.headers.cookie);

    //new Date(ミリ秒) を使ってより見やすくする
    //Cookie が取得できたときは、 last_access=1452147999931 からミリ秒を表す文字列 1452147999931 を抜き出し、 parseInt() で数値に変換して last_access_time に代入しています。
    const last_access_time =req.headers.cookie ? parseInt(req.headers.cookie.split('last_access=')[1]) : now;
    res.end(new Date(last_access_time).toString());
});
const port = 8000;
//listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): Server
server.listen(port, () => {
    console.info('Listening on' + port);
});
