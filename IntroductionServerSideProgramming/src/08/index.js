// 説明
// N予備 07 モジュール化された処理
//CRUD はクラッドと呼び、ソフトウェアが情報の永続化をしようとした時に出てくる操作の、 Create (生成)・Read (読み取り)・Update (更新)・Delete (削除) の頭文字を取ったものです。

/*
CRUD	command	対応要件
Create	todo	タスクの作成
Update	done	タスクの状態の更新
Read	list	タスクの状態が未完了のものの読み込み
Read	donelist	タスクの状態が完了のものの読み込み
Delete	del	タスクの削除
*/

// todo> ○○する という発言で「○○する」というタスクを作成
// list> という発言で未完了のタスクの一覧を表示

'use strict';
// key:　タスクの文字列 value:完了しているかの真偽値
const tasks = new Map();

/**
 * TODOを追加する
 * @param {string} task
 */
function todo(task){
    //まだ完了してないのでfalse
    tasks.set(task,false);
}

/**
 * タスクと完了したかどうかが含まれる配列を受け取り、完了したかを返す
 * @param {array} taskAndIsDonePair
 * @return {boolean} 完了したかどうか
 */
function isDone(taskAndIsDonePair) {
    return taskAndIsDonePair[1];
}

/**
 * タスクと完了したかどうかが含まれる配列を受け取り、完了していないかを返す
 * @param {array} taskAndIsDonePair
 * @return {boolean} 完了したかどうか
 */
function isNotDone(taskAndIsDonePair) {
    return !isDone(taskAndIsDonePair);
}

/**
 * TODOの一覧の配列を取得する
 * @return {array}
 */
function list(){
    //Map連想配列からの型変換？でfilterしてtureになるものだけを抽出して,Kyeのみを取り出す
    return Array.from(tasks).filter(isNotDone).map(t => t[0]);
}
/**
 * TODOを完了状態にする
 * @param {string} task
 */
function done(task) {
    if (tasks.has(task)) {
        tasks.set(task, true)
    }
}

/**
 * 完了済みのタスクの一覧の配列を取得する
 * @return {array}
 */
function donelist() {
    return Array.from(tasks).filter(isDone).map(t => t[0]);
}

/**
 * 項目を削除する
 * @param {string} task
 */
function del(task){
    tasks.delete(task);
}


//練習問題seventeen モジュールを作成する
//整数が 17 で割り切れるかどうかを判定する isMultipleOfSeventeen 関数

/**
 * @param {Int} number
 * @return {boolean} trueかfalseか
 */
function isMultipleOfSeventeen(number) {
    return number % 17 === 0;
}

//todo という関数をパッケージの関数として外部に公開する実装
//node.jsだから使えるっぽい
module.exports = { 
    todo, 
    list,
    done,
    donelist,
    del,
    isMultipleOfSeventeen
};