var myBirthTime = new Date(1992,10,17,12,30);
function updateparagraph(){
    var now = new Date();
    var seconds = (now.getTime() - myBirthTime.getTime()) /1000;
    document.getElementById("birth-time").innerText = "生まれてから" + seconds
}
setInterval(updateparagraph, 50);