var express = require('express');
var router = express.Router();
const Schedule = require('../models/schedule');

/* GET home page. */
router.get('/', (req, res, next) => {
  const title = '予定調整くん';
  if (req.user) {
    // findAll 関数は、 条件にあったデータモデルに対応するレコードを全て取得する関数
    Schedule.findAll({
      // また処理全体を認証済みかどうか（req.user オブジェクトがあるかどうか）で、振り分けています。
      where: {
        createdBy: req.user.id
      },
      order: [['"updatedAt"', 'DESC']]
    }).then((schedules) => {
      res.render('index', {
        title: title,
        user: req.user,
        schedules
      });
    });
  } else {
    res.render('index', { title: title });
  }
});

module.exports = router;
