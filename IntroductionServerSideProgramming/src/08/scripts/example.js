//07でつくったindex.jsのモジュールを読み込みbotインターフェースを作成する
//todoファイルを作ってその中にindex.jsをつくってnode_modulesの中に入れておくとできた

//使い方 このbotの名前はhubot
//yarn hubot
//hubot todo 鉛筆を買う
/**
 * どうしてmatch[1]とかくのかとおもったら、matchというオブジェクトが存在していたからだった
 * match: [
    'hubot todo 鉛筆を買う',
    '鉛筆を買う',
    index: 0,
    input: 'hubot todo 鉛筆を買う',
    groups: undefined
  ],

  Slackのトークンを忘れた場合はここ
  https://slack.com/apps/manage#existing
  
  下記のコマンドを実行する
  env HUBOT_SLACK_TOKEN=xoxb-16455131522-XXXXXXXXXXXXXXXXXXXX bin/hubot -a slack
  
  Slack上での実行は下記のようにする
  nakagawa-hubot-study todo 鉛筆を買う
 */


// Description:
//   TODO を管理することができるボットです
// Commands:
//   ボット名 todo     - TODO を作成
//   ボット名 done     - TODO を完了にする
//   ボット名 del      - TODO を消す
//   ボット名 list     - TODO の一覧表示
//   ボット名 donelist - 完了した TODO の一覧表示

'use strict'
const todo = require('todo');
console.log(todo.list());
module.exports = (robot) => {
  //respond 関数は、ボットの名前が一緒に呼び出された時のみ反応する関数
  //todo で始まり、その後に 1 つスペースを置いて何らかの文字列が記述されているという正規表現
  //iは大文字でも小文字でもマッチするというオプション
  //. が改行文字以外のどの 1 文字にもマッチする文字であり、 + は直前の文字の 1 回以上の繰り返しにマッチするという意味
  robot.respond(/todo (.+)/i, (msg) => {
    //添字の 1 には、1番目の () でマッチした文字列が、 添字の 0 にはマッチした文字列全体が含まれています。
    //trim 関数は文字列の両端の空白を取り除いた文字列を取得する関数
    const task = msg.match[1].trim();
    todo.todo(task);
    msg.send('追加しました:' + task);
  })

  robot.respond(/done (.+)/i, (msg) => { 
    const task = msg.msg[1].trim();
    todo.done(task);
    msg.send('完了しました: ' + task);
  });

  robot.respond(/del (.+)/i, (msg) => { 
    const task = msg.msg[1].trim();
    todo.del(task);
    msg.send('削除しました: ' + task);
  });
  
  robot.respond(/list/i, (msg) => {
    //join 関数は、 配列の全ての要素を与えられた文字列で繋いで一つの文字列にする関数
    //改行を表すエスケープシーケンスで結合
    console.log(todo.list());
    console.log(isEmpty(todo.list()));
    if (isEmpty(todo.list())) {
      msg.send("TODOはありません");
    } else {
      msg.send(todo.list().join('\n'));
    }
  });

  robot.respond(/donelist/i, (msg) => {
    if (isEmpty(todo.donelist())) {
      msg.send("完了したTODOはありません");
    } else {
      msg.send(todo.donelist().join('\n'));
    }
  });

  // robot.hear(/badger/i, (res) => {
  //   res.send('Badgers? BADGERS? WE DON’T NEED NO STINKIN BADGERS')
  // })
  //
  // robot.respond(/open the (.*) doors/i, (res) => {
  //   const doorType = res.match[1]
  
  //   if (doorType === 'pod bay') {
  //     res.reply('I’m afraid I can’t let you do that.')
  //     return
  //   }
  //
  //   res.reply('Opening #{doorType} doors')
  // })
  //
  // robot.hear(/I like pie/i, (res) => {
  //   res.emote('makes a freshly baked pie')
  // })
  //
  // const lulz = ['lol', 'rofl', 'lmao']
  //
  // robot.respond(`/${lulz.join('|')}/i`, (res) => {
  //   res.send(res.random(lulz))
  // })
  //
  // robot.topic((res) => {
  //   res.send(`${res.message.text}? That’s a Paddlin`)
  // })
  //
  // const enterReplies = ['Hi', 'Target Acquired', 'Firing', 'Hello friend.', 'Gotcha', 'I see you']
  // const leaveReplies = ['Are you still there?', 'Target lost', 'Searching']
  //
  // robot.enter((res) => {
  //   res.send(res.random(enterReplies))
  // })
  // robot.leave((res) => {
  //   res.send(res.random(leaveReplies))
  // })
  //
  // const answer = process.env.HUBOT_ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING
  //
  // robot.respond(/what is the answer to the ultimate question of life/, (res) => {
  //   if (answer) {
  //     res.send(`${answer}, but what is the question?`)
  //     return
  //   }
  //
  //   res.send('Missing HUBOT_ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING in environment: please set and try again')
  // })
  //
  // robot.respond(/you are a little slow/, (res) => {
  //   setTimeout(() => res.send('Who you calling "slow"?'), 60 * 1000)
  // })
  //
  // let annoyIntervalId = null
  //
  // robot.respond(/annoy me/, (res) => {
  //   if (annoyIntervalId) {
  //     res.send('AAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEEEEIIIIIIIIHHHHHHHHHH')
  //     return
  //   }
  //
  //   res.send('Hey, want to hear the most annoying sound in the world?')
  //   annoyIntervalId = setInterval(() => res.send('AAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEEEEIIIIIIIIHHHHHHHHHH'), 1000)
  // })
  //
  // robot.respond(/unannoy me/, (res) => {
  //   if (!annoyIntervalId) {
  //     res.send('Not annoying you right now, am I?')
  //     return
  //   }
  //
  //   res.send('OKAY, OKAY, OKAY!')
  //   clearInterval(annoyIntervalId)
  //   annoyIntervalId = null
  // })
  //
  //
  // robot.router.post('/hubot/chatsecrets/:room', (req, res) => {
  //   const room = req.params.room
  //   const data = JSON.parse(req.body.payload)
  //   const secret = data.secret
  //
  //   robot.messageRoom(room, `I have a secret: ${secret}`)
  //
  //   res.send('OK')
  // })
  //
  // robot.error((error, response) => {
  //   const message = `DOES NOT COMPUTE: ${error.toString()}`
  //   robot.logger.error(message)
  //
  //   if (response) {
  //     response.reply(message)
  //   }
  // })
  //
  // robot.respond(/have a soda/i, (response) => {
  //   // Get number of sodas had (coerced to a number).
  //   const sodasHad = +robot.brain.get('totalSodas') || 0
  //
  //   if (sodasHad > 4) {
  //     response.reply('I’m too fizzy…')
  //     return
  //   }
  //
  //   response.reply('Sure!')
  //   robot.brain.set('totalSodas', sodasHad + 1)
  // })
  //
  // robot.respond(/sleep it off/i, (res) => {
  //   robot.brain.set('totalSodas', 0)
  //   res.reply('zzzzz')
  // })
}

function isEmpty(val){

  if ( !val ) {//null or undefined or ''(空文字) or 0 or false

      if ( val !== 0 && val !== false ) {
          return true;
      }

  }else if( typeof val == "object"){//array or object

      return Object.keys(val).length === 0;

  }

  return false;//値は空ではない
}