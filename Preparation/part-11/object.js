var game = {
    startTime: null,
    displayArea: document.getElementById("display-area"),
    start: function() {
        game.startTime = Date.now();
        //
        //https://developer.mozilla.org/ja/docs/Web/API/GlobalEventHandlers/onkeypress
        document.body.onkeypress = game.stop;
        console.log("スタートしました");
    },
    stop: function() {
        var currentTime = Date.now();
        var seconds = (currentTime - game.startTime) / 1000;
        if (9.5 <= seconds && seconds <= 10.5){
            game.displayArea.innerText = seconds;
        } else {
            game.displayArea.innerText = seconds;
        }
        console.log("ストップしました")
    }
}

//memo
//引数で渡した文字列をダイアログで表示する関数でアラートと異なり、
//trueとfalseが返り値に帰ってくる
if (confirm("OKを押して10秒だとおもったらなにかキーを押す")) {
    game.start()
}

