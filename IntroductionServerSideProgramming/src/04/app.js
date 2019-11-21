// 説明
// yarnでrequestというライブラリを導入して使ってみた

'use strict';
const request = require('request');
request('http://www.google.com', function (error, response, body) {
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:',body);
})