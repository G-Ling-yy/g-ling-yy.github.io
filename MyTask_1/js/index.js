window.onload = function(){
  document.querySelector('#sound-background').volume = '.5';
	document.querySelector('#head-sculpture-img').onclick = function(){
    document.querySelector('#sound-whatmortal').play();
		var newdiv = document.createElement('div');
		newdiv.setAttribute('class','justshowitforyou');
		document.body.appendChild(newdiv);
    setTimeout(function(){document.body.removeChild(newdiv);},5000);
	};
  var spantimes = 0;
  function coinsPlus(){
    document.querySelector('#coins').innerHTML = '$ ' + spantimes;
    spantimes+=1;
  }
  function timesPlus(){
    var tnow = new Date();
    var h = tnow.getHours();
    var m = tnow.getMinutes();
    var s = tnow.getSeconds();
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    document.querySelector('#times').innerHTML =  h + ':' + m + ':' + s;
  }
  setInterval(coinsPlus,1234);
  setInterval(timesPlus,1000);
  document.body.onclick = function(){
    var soundname = ['Thenightbecons','Greetings','Whatisitnow','Thatwasmyplan','Verywell'];
    var sound = document.querySelector('#sound-random');
    var i = Math.floor(Math.random() * 20);
    switch(i){
      case 1 :sound.src = 'sounds/' + soundname[i] +'.wav';break;
      case 2 :sound.src = 'sounds/' + soundname[i] +'.wav';break;
      case 3 :sound.src = 'sounds/' + soundname[i] +'.wav';break;
      case 4 :sound.src = 'sounds/' + soundname[i] +'.wav';break;
      case 0 :sound.src = 'sounds/' + soundname[i] +'.wav';break;
      default:sound.src = '';break;
    }
    sound.play();
  }
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
};