'use strict';
//課題トリボナッチ数列を出す
//キーには順番を、値には答えを格納します。
//連想配列
const memo = new Map();
//0 番目と 1 番目の答えは予め定義されているので入れておく
memo.set(0,0);
memo.set(1,0);
memo.set(2,1);

function fib(n) {
    if(memo.has(n)) {
        return memo.get(n);
    }
    const value = fib(n-1) + fib(n-2) + fib(n-3);
    memo.set(n,value);
    return value
}

//計算してみる
const length = 40;
for (let i = 0; i<= length; i++){
    console.log(fib(i));
}
