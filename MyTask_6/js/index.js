window.onload = function(){
  function changeMywcolor(){
    var a = Math.floor(Math.random()*255);
    var b = Math.floor(Math.random()*255);
    var c = Math.floor(Math.random()*255);
    var d = Math.random();
    document.querySelector('#myword').style.color = 'rgba(' + a + ',' + b + ',' + c + ',' + d + ')';
  }
  var cm = setInterval(changeMywcolor,5000);
  var lis = document.querySelectorAll('#myrectnav ul li');
  lis[0].addEventListener('click',function(e){
    if (e.target.nodeName == 'SPAN') {
      document.querySelector('#myrectnav input').style.display = 'block';
      document.querySelector('#myrectnav button').style.display = 'block';
    }
  })
  document.querySelector('#myrectnav button').addEventListener('click',function(){
    this.parentNode.style.background = document.querySelector('#myrectnav input').value;
    document.querySelector('#myrectnav input').style.display = 'none';
    this.style.display = 'none';
  })
  lis[1].addEventListener('click',function(e){
    if (e.target.nodeName == 'SPAN'){
      document.querySelector('#myroundnav').classList.toggle('visibility-visible');
      var span = document.querySelector('#myrectnav ul li:nth-child(2) span');
      span.innerHTML = (span.innerHTML == '出现点啥')?'去掉点啥':'出现点啥';
    }  
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
    var setgoto = setInterval(function(){
      if (document.body.scrollTop < 450) {
        document.body.scrollTop += 5;
      }else if(document.body.scrollTop >= 450) {
        clearInterval(setgoto);
      }
    },10);
  })
  document.querySelector('#myroundnav ul li:first-child').addEventListener('click',function(){
    window.open('https://github.com/fe13/fe/blob/master/CSS/CSS 动画.md');
  })
  document.querySelector('#myroundnav ul li:nth-child(2)').addEventListener('click',function(){
    window.open('https://github.com/fe13/fe/blob/master/CSS/04.CSS 选择器.md');
  })
  document.querySelector('#myroundnav ul li:nth-child(3)').addEventListener('click',function(){
    alert('我是一个绿色的导航链接~好吧虽然我并没有链接什么');
  })
  document.querySelector('#myroundnav ul li:nth-child(4)').addEventListener('click',function(){
    alert('我猜你肯定觉得我把按钮和文字搞错了，而且你是先点了蓝色的按钮才看得懂我的意思~/坏笑');
  })
};