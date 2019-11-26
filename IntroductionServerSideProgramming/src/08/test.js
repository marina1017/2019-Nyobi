'use strict';
const todo = require('./index.js');
//Node.js でテストをするためのモジュールの assert を呼び出しています。
const assert = require('assert');

//todoとlistのテスト
todo.todo('ノートを買う');
todo.todo('鉛筆を買う');
assert.deepEqual(todo.list(),['ノートを買う', '鉛筆を買う']);

//doneとdonelistのテスト
todo.done('鉛筆を買う');
assert.deepEqual(todo.list(),['ノートを買う']);
assert.deepEqual(todo.donelist(), ['鉛筆を買う']);

//delのテスト
todo.del('ノートを買う');
todo.del('鉛筆を買う');
assert.deepEqual(todo.list(),[]);
assert.deepEqual(todo.donelist(),[]);
console.log('テストが完了しました');

console.log(todo.isMultipleOfSeventeen(17));
assert.deepEqual(todo.isMultipleOfSeventeen(17),true);
assert.deepEqual(todo.isMultipleOfSeventeen(18),false);
