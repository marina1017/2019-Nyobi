// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
'use strict';

const http = require('http'); //ドキュメント　http.createServer(requestListener);
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
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress); //writeHead(statusCode: number, reasonPhrase?: string, headers?: OutgoingHttpHeaders): ServerResponse
  //内容の形式 Content-Type が、text/plain という通常のテキストであるという情報
  //文字セット charset が utf-8 であるという情報

  res.writeHead(200, {
    'content-Type': 'text/html; charset=utf-8'
  }); // メソッドによって分岐させている
  //GETでアクセスした時にアンケートフォームを表示させる

  switch (req.method) {
    case 'GET':
      res.write('GET ' + req.url);

      const fs = require('fs');

      const rs = fs.createReadStream('./form.html'); //パイプをしている
      //Node.js では Stream の形式のデータは、読み込み用の Stream と書き込み用の Stream を繋いで そのままデータを受け渡すことができる。 
      //その関数が pipe という関数の機能
      //HTTP のレスポンスのコンテンツとしてファイルの内容をそのまま 返す。

      rs.pipe(res);
      break;

    case 'POST':
      let rawData = '';
      req.on('data', chunk => {
        rawData = rawData + chunk;
      }).on('end', () => {
        const decoded = decodeURIComponent(rawData);
        console.info('[' + now + '] 投稿:' + decoded);
        res.write('<!DOCTYPE html> <html lang="ja"><body><h1>' + decoded + 'が投稿されました</h1></body></html>'); //POST メソッドを使った場合のみ res.end を行うようにする

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
  }

  ;
}).on('error', e => {
  console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', e => {
  console.error('[' + new Date() + '] Server Error', e);
});
const port = 8000; //最後のこのコードは、この HTTP が起動するポートを宣言し、
// そしてサーバーを起動して、起動した際に実行する関数を渡しています。
//listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): Server

server.listen(port, () => {
  console.info('listening on' + new Date() + port);
});
},{}]},{},["index.js"], null)
//# sourceMappingURL=/index.js.map