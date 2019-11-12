var startTime = null;
function start() {
    startTime = Date.now();
    //
    //https://developer.mozilla.org/ja/docs/Web/API/GlobalEventHandlers/onkeypress
    document.body.onkeypress = stop;
    console.log("スタートしました");
}

function stop() {
    console.log("ストップしました")
}

//memo
//引数で渡した文字列をダイアログで表示する関数でアラートと異なり、
//trueとfalseが返り値に帰ってくる
if (confirm("OKを押して10秒だとおもったらなにかキーを押す")) {
    start()
}

