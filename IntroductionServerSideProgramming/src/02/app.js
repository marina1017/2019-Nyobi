'use strict';

function fib(n) {
    if (n === 0) {
        return 0;
    } else if (n === 1 ){
        return 1;
    }
    return fib(n-1) + fib(n-2)
}

//これだとめちゃくちゃ時間がかかってしまう
//「time node src/02/app.js」というコマンドを実行してみると
//2.87 real         2.79 user         0.02 sysという結果になる
//計算量はO(n)になる
const length = 40;
for (let i = 0; i<= length; i++){
    console.log(fib(i));
}

//##ログファイルを出してみる
//node --prof src/02/app.js　のコマンドを実行すると　isolate-0x103801400-v8.logが出てくる
//node --prof-process isolate-0x103801400-v8.log　のコマンドでわかりやすくなる
//[Summary]:のなかにどれが一番処理に時間がかかったが書いてる
// ticks  total  nonlib   name
// 1924   87.1%   87.3%  JavaScript
//  107    4.8%    4.9%  C++
//    2    0.1%    0.1%  GC
//    6    0.3%          Shared libraries
//  172    7.8%          Unaccounted


// # 時間のかかった処理はどこか
// [Bottom up (heavy) profile]:を見る
//   Note: percentage shows a share of a particular caller in the total
//   amount of its parent calls.
//   Callers occupying less than 1.0% are not shown.
// アルゴリズムを改善するべき
