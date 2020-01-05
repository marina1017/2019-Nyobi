'use strict';
const pug = require('pug');
const assert = require('assert');

var path = require('path');

//実行したnode.jsのパス
const pathstr = process.argv[1]

//pugのテンプレートにおけるXSSの脆弱性テスト
const html = pug.renderFile(path.dirname(pathstr) + '/views/posts.pug',{
    posts:[{
        id: 1,
        content: '<script>alert(\'test\');</script>',
        postedBy: 'guest1',
        trackingCookie: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    }],
    user: 'guest1'
});

//スクリプトタグがエスケープされて含まれていることをちぇっく
assert(html.includes('&lt;script&gt;alert(\'test\');&lt;/script&gt;'));
console.log('テストが正常に完了しました');