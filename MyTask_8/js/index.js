window.onload = function(){
  function changeMywcolor(){
    var a = Math.floor(Math.random()*255);
    var b = Math.floor(Math.random()*255);
    var c = Math.floor(Math.random()*255);
    var d = Math.random();
    document.querySelector('#myword').style.color = 'rgba(' + a + ',' + b + ',' + c + ',' + d + ')';
  }
  var cm = setInterval(changeMywcolor,5000);
  document.querySelector('#demo').addEventListener('click',function(){
    var div = document.createElement('div');
    var txt = '<img src="images/3D-demo.gif" style="border-radius: 20px"/>';
    div.innerHTML = txt;
    div.setAttribute('class','lightbluebacklayer');
    div.addEventListener('click',function(e){
      if (e.target.nodeName != 'IMG') {
        document.body.removeChild(this);
      }
    })
    document.body.appendChild(div);
  })
  document.querySelector('#triangletop').addEventListener('click',function(){
    var backtopset = setInterval(function(){
      if (document.body.scrollTop > 0) {
        document.body.scrollTop -= 5;
      }else if(document.body.scrollTop <= 0) {
        clearInterval(backtopset);
      }
    },10);
  })
  document.querySelector('#trianglebottom').addEventListener('click',function(){
    var length = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var gobottomset = setInterval(function(){
      if (document.body.scrollTop < length) {
        document.body.scrollTop += 5;
      }else if(document.body.scrollTop >= length) {
        clearInterval(gobottomset);
      }
    },10);
  })
};