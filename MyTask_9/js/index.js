window.onload = function(){
  function changeMywcolor(){
    var a = Math.floor(Math.random()*255);
    var b = Math.floor(Math.random()*255);
    var c = Math.floor(Math.random()*255);
    var d = Math.random();
    document.querySelector('#myword').style.color = 'rgba(' + a + ',' + b + ',' + c + ',' + d + ')';
  }
  var cm = setInterval(changeMywcolor,5000);
  document.body.onscroll = function(){
    if (document.body.scrollTop == 0) {
      document.querySelector('#triangletop').style.display = 'none';
    }else if (document.body.scrollTop == document.documentElement.scrollHeight - document.documentElement.clientHeight) {
      document.querySelector('#trianglebottom').style.display = 'none';
    }else {
      document.querySelector('#triangletop').style.display = 'block';
      document.querySelector('#trianglebottom').style.display = 'block';
    }
  }
  document.querySelector('#triangletop').addEventListener('click',function(){
      var backtopset = setInterval(function(){
      if (document.querySelector('main').scrollTop > 0) {
        document.querySelector('main').scrollTop -= 5;
      }else if(document.querySelector('main').scrollTop <= 0) {
        clearInterval(backtopset);
      }
    },10);
  })
  document.querySelector('#trianglebottom').addEventListener('click',function(){
    var length = document.querySelector('main').scrollHeight - document.querySelector('main').clientHeight;
    var gobottomset = setInterval(function(){
      if (document.querySelector('main').scrollTop < length) {
        document.querySelector('main').scrollTop += 5;
      }else if(document.querySelector('main').scrollTop >= length) {
        clearInterval(gobottomset);
      }
    },10);
  })
  document.querySelector('.froggypic').addEventListener('click',function(){
    this.classList.toggle('froggypic-big');
  })
};