var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res というオブジェクトを使うところで render 関数ではなく、 send 関数が呼ばれています。
  res.send('respond with a resource');
});

module.exports = router;
