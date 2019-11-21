'use strict';
// ファイルからデータを読み取る
// 2010 年と 2015 年のデータを選ぶ
// 都道府県ごとの変化率を計算する
// 変化率ごとに並べる
// 並べられたものを表示する

//fsはファイルシステムの略
const fs = require('fs');
//readlineはファイルを一行ずつ読み込むためのモジュール
const readline = require('readline');
//popu-pref.csv ファイルから、ファイルを読み込みを行う Stream（ストリーム）を生成
//Stream とは、非同期で情報を取り扱うための概念で、情報自体ではなく情報の流れに注目します。
const rs = fs.createReadStream('./popu-pref.csv');
//readline オブジェクトの input として設定し、 rl オブジェクトを作成する
const rl = readline.createInterface({'input': rs, 'output': {}});
// 連想配列を使う　key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map();

//Node.js で Stream を扱う際は、 Stream に対してイベントを監視し、 
//イベントが発生した時に呼び出される関数を設定することによって、情報を利用します。
//rl オブジェクトで line というイベントが発生したら この無名関数を呼ぶ
//ドキュメントはここ https://nodejs.org/docs/v10.14.2/api/readline.html
//一行ずつ流れてくるイメージ
rl.on('line', (lineString) => {
    //lineString で与えられた文字列をカンマ , で分割
    //集計年,都道府県名,10〜14歳の人口,15〜19歳の人口
    //→["集計年","都道府県名","10〜14歳の人口","15〜19歳の人口"]
    const columns = lineString.split(',');
    //console.log(columns)
    //集計年（0 番目）
    //parseInt()文字列を整数値に変換する関数
    const year = parseInt(columns[0]);
    //都道府県（2 番目）
    const prefecture = columns[2];
    //15〜19 歳の人口（8 番目)
    const popu = parseInt(columns[8]);
    //2010年と2015年に絞る
    if (year === 2010 || year == 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            //その県のデータを処理するのが初めてであれば、value に初期値となるオブジェクトを代入する
            //popu10:2010 年の人口
            //popu15 が 2015 年の人口
            //change が人口の変化率を表す
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
//'close' イベントは、全ての行を読み込み終わった際に呼び出されます。
rl.on('close', () => {
    //人工の変化率を計算する
    for (let [key,value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    //データの並び替えをおこなう
    //Array.from(連想配列)で連想配列を普通の配列に変換する
    //sort に対して渡すこの関数は比較関数という
    //前者の引数 pair1 を 後者の引数 pair2 より前にしたいときは負の整数、
    // pair2 を pair1 より前にしたいときは、正の整数、
    // pair1 と pair2 の並びをそのままにしたいときは、 0 を返す必要があります。
    const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) => {
        console.log("pair1",pair1[1].change)
        console.log("pair2",pair2[1].change)
        //変化率の降順に並び替えが行われます
        return pair1[1].change - pair2[1].change;
    });
    //データの整形をおこなう
    const rankingStrings = rankingArray.map(([key, value],i) => {
        return i+1 + '位' + key + ':' + value.popu10 + '=>' + value.popu15 + '変化量' + value.change;
    });
    console.log(rankingStrings);
})