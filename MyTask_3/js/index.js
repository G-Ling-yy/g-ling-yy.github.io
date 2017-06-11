window.onload = function(){
  document.body.onscroll = function(){
    if (document.body.scrollTop >= 1600) {
      document.querySelector('#backtop').style.display = 'block';
    }else{
      document.querySelector('#backtop').style.display = 'none';
    }
  }
  function changeMywcolor(){
    var a = Math.floor(Math.random()*255);
    var b = Math.floor(Math.random()*255);
    var c = Math.floor(Math.random()*255);
    var d = Math.random();
    document.querySelector('#myword').style.color = 'rgba(' + a + ',' + b + ',' + c + ',' + d + ')';
  }
  var cm = setInterval(changeMywcolor,5000);
  function showBigger(it){
    it.setAttribute('class','showbigger');
    it.style.transform = 'scale(7)';
    it.style.opacity = '0';
    setTimeout(function(){
      it.setAttribute('class','');
      it.style.cssText = '';
    },2000);
  }
  function decideEleshow(){
    var tds = document.querySelectorAll('.hero-icon');
    for(var i = 0; i < tds.length; i++){
      tds[i].addEventListener('click',function(e){
        if (e.target.nodeName == 'IMG') {
          showBigger(e.target);
        }
      });
    }
  }
  decideEleshow();
};