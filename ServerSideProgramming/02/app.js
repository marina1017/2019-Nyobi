var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var photosRouter = require('./routes/photos');

//ここで、 Application オブジェクトを express のモジュールを利用して作成し、 app という変数に格納しています。
//Application オブジェクト には、 use 関数という Middleware や Router オブジェクト を登録するための関数があります。
//Middleware とは、 helmet のような Express の機能を拡張するモジュールのことです。
var app = express();
app.use(helmet());

// view engine setup
//テンプレートのファイルが views ディレクトリにあることと、 テンプレートエンジンが pug であることを設定しています。
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//ログを出すための logger を使う設定
app.use(logger('dev'));
//json 形式を解釈したり作成するための json を使う設定
app.use(express.json());
//URL をエンコードしたりデコードするための urlencoded を使う設定
app.use(express.urlencoded({ extended: false }));
//Cookie を解釈したり作成するための cookieParser を使う設定
app.use(cookieParser());
//静的なファイルを public というディレクトリにするという設定です。
app.use(express.static(path.join(__dirname, 'public')));

/// というパスにアクセスされた時は、routes/index.js で記述している Router オブジェクトを、 /users というパスにアクセスされた時は、
// routes/users.js で記述した Router オブジェクトを利用するように、記述しています。
// Express というフレームワークは、このように該当するパスや条件に関して、 Router オブジェクトのような処理を実行するオブジェクトを複数登録して、逐次処理していく仕組みで作られています。
// この時に逐次処理を行っていく関数のことをハンドラといいます。
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/photos', photosRouter);


// 存在しないパスへのアクセスがあった際の処理が記述されています。
//エラーを発生させて、その err のプロパティの status に 404 というステータスコードを設定し、 next 関数を呼び出しています。
//この next 関数の呼び出しにより、もし次のリクエストのハンドラが登録されていれば そのハンドラが引き続き呼び出されます。
app.use(function(req, res, next) {
  next(createError(404));
});

// views/error.pug というテンプレートを使ってエラーを表示させるという記述です。
app.use(function(err, req, res, next) {
  // Application オブジェクトに登録された env という値が development である場合つまり開発環境の場合は、 エラーのオブジェクトをテンプレートに渡し、 そうではない本番環境におけるエラーの時は、 スタックトレースを表示させるエラーオブジェクトはテンプレートに渡さない実装となっています。
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//ここまでに設定した Application オブジェクトを、モジュールとして設定する記述です。
module.exports = app;
