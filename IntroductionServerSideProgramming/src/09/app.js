// 同期 I/O と非同期 I/O
// yarn parcel node src/09/app.js
'use strict';
const fs = require('fs');
const fileName = 'test.txt'
for (let count = 0; count < 500; count ++){
    //() => {} の部分はコールバック関数と呼ばれ、 appendFile を行ったあとの処理を指定します。
    //非同期 I/O を利用する関数においては、このコールバック関数を指定しないとエラーになりますが、
    //今回は「何もしない」という意味の () => {} という関数を渡しています。
    //appendFileは非同期 I/O
    // fs.appendFile(fileName, 'あ', 'utf8', () => {});
    // fs.appendFile(fileName, 'い', 'utf8', () => {});
    // fs.appendFile(fileName, 'う', 'utf8', () => {});
    // fs.appendFile(fileName, 'え', 'utf8', () => {});
    // fs.appendFile(fileName, 'お', 'utf8', () => {});
    // fs.appendFile(fileName, '\n', 'utf8', () => {});

    //appendFileSyncは同期 I/O
    fs.appendFileSync(fileName, 'あ', 'utf8');
    fs.appendFileSync(fileName, 'い', 'utf8');
    fs.appendFileSync(fileName, 'う', 'utf8');
    fs.appendFileSync(fileName, 'え', 'utf8');
    fs.appendFileSync(fileName, 'お', 'utf8');
    fs.appendFileSync(fileName, '\n', 'utf8');
}