'use strict';

//キーには順番を、値には答えを格納します。
//連想配列
const memo = new Map();
//0 番目と 1 番目の答えは予め定義されているので入れておく
memo.set(0,0);
memo.set(1,1);

function fib(n) {
    if(memo.has(n)) {
        return memo.get(n);
    }
    const value = fib(n-1) + fib(n-2);
    memo.set(n,value);
    return value
}

//#これで時間計測をしてみる
//time node src/02/app2.js
//0.07 real         0.05 user         0.01 sys
//めちゃくちゃ早・・・・くなった
//node --prof-process isolate-0x103802400-v8.log
//でみてみるとぜんぜん違うことがわかる
//このオーダーはO(n)