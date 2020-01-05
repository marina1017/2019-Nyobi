'use strict';
const Sequelize = require('sequelize');
//DB の設定を渡したうえで 秘密の匿名掲示板を表すデータベースのオブジェクトを作成しています。
const sequelize = new Sequelize(
    //データベースを Heroku が用意した URL のものを利用する設定
    process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/secret_board',
    {
        //sequelize が出すログの設定をオフにしています
        logging: false,
        //sequelize の演算子エイリアスも使わないのでオフにしています。
        operatorsAliases: false
    });

//##データモデリング
//投稿内容
//投稿したユーザー名
//トラッキングCookieの内容
//作成日時
const Post = sequelize.define('Post',{
    //入力する情報が一つに特定できような固有な ID を付加し、それが本当に固有であるのかどうかをチェックしてくれる primaryKey という設定
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    //制限のない大きな長い文字列を保存できる設定
    content: {
        type: Sequelize.TEXT
    },
    //投稿したユーザーの名前 255 文字までの長さを保存できる設定
    postedBy: {
        type: Sequelize.STRING
    },
    //後ほどユーザーごとに付与する Cookie に保存する値
    trackingCookie: {
        type: Sequelize.STRING
    }
},{
    //テーブルという定義したデータを保存する領域の名前を Post という名前に固定するという設定
    freezeTableName: true,
    //自動的に createdAt という作成日時と updatedAt という更新日時を自動的に追加してくれる設定
    timestamps: true
});
//定義をした Post というオブジェクト自体をデータベースに適用して同期を取っています
Post.sync();
//このオブジェクト自体をモジュールとして公開
module.exports = Post;