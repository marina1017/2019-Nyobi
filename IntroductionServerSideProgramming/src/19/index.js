//UI、URI、モジュールの設計
// GET	/posts	投稿一覧
// 投稿一覧の表示には /posts というパスを利用します。
// また投稿一覧には投稿フォームも設置します。

// POST	/posts	投稿とリダイレクト
// 投稿には POST メソッドを用います。
// また 投稿処理が完了したあと投稿一覧へのリダイレクト処理を行います。

// POST	/posts?delete=1	削除
//削除に関しては、 DELETE のメソッドを利用したいところですが、 実は HTML の <form> タグの機能だけでは GET と POST しか使用できません。
//そのためここでは、 /posts?delete=1 のように ?delete=1 というクエリをつけて POST を利用します。

// GET	/logout	ログアウト
// GET	/favicon.ico	ファビコン

//　まとめ
// HTML のフォームの機能だけでは、GET と POST のメソッドしか利用できない
// リダイレクトとは、サイトにアクセスしたユーザーをアクセスした URI とは別の URI にアクセスさせること
// HTTP ステータスコードの 300 番台を利用することで、リダイレクトをさせることができる

//リダイレクト例

'use strict';
const http = require('http');
const server = http.createServer((req, res) => {
    //ステータスコードの 302 - Found は「Location という項目のヘッダで指定されたサイトに内容を発見した」ということを表すステータスコードとなります。
    //writeHead(statusCode: number, reasonPhrase?: string, headers?: OutgoingHttpHeaders): ServerResponse
    res.writeHead(302, {
        'Location': 'https://www.nicovideo.jp/'
    });
    res.end();
})
const port = 8000;
server.listen(port, () => {
    console.info('Listening on' + port);
});