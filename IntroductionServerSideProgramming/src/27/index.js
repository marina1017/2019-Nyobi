'use strict';
const http = require('http');
//child_process という子どものプロセスを作るモジュール
const cp = require('child_process');
const server = http.createServer((req, res) => {
    const path = req.url;
    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8'
    })
    //child_process モジュールの execSync は同期的に与えられたコマンドを実行し、標準出力を結果として取得します。
    //res.end(cp.execSync('echo ' + path));
   
    //execSync のような OS コマンドを実行する関数はなるべく使わないことが望ましいです。
    res.end(path);
});
const port = 8000;
server.listen(port, () => {
    console.info('Listening on ' + port);
});
