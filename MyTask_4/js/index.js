window.onload = function(){
  document.querySelector('.downloadapp-btn').addEventListener('click',function(){
    var qr_card = document.querySelector('.QRcode-card');
    if (this.innerHTML == '关闭二维码') {
      document.querySelector('.QRcode-card').classList.remove('QRcode-card-show');
      this.innerHTML = '下载知乎 App';
    }else{
      /*这样写必须得点击按钮才能关闭二维码，要想实现点击旁白关闭二维码我暂时只有借助jq，不然一时没思路*/
      this.innerHTML = '关闭二维码';
      document.querySelector('.QRcode-card').classList.add('QRcode-card-show');
    }
  });
  document.querySelector('.sign-uporin').addEventListener('click',function(e){
    if (e.target.id == 'sign-up') {
      document.querySelector('#sign-up').classList.add('sign-active');
      document.querySelector('#sign-in').classList.remove('sign-active');
      document.querySelector('#slide-underline').style.left = '93px';
      document.querySelector('#signup-form').style.display = 'block';
      document.querySelector('#signin-form').style.display = 'none';
    }else if (e.target.id == 'sign-in'){
      document.querySelector('#sign-in').classList.add('sign-active');
      document.querySelector('#sign-up').classList.remove('sign-active');
      document.querySelector('#slide-underline').style.left = '165px';
      document.querySelector('#signin-form').style.display = 'block';
      document.querySelector('#signup-form').style.display = 'none';
    }
  });
  document.querySelector('#signinbyotheraccounts').addEventListener('click',function(){
    document.querySelector('.accounts-visible').classList.toggle('accounts-visible-show');
  });
  document.querySelector('#unable-login').addEventListener('click',function(){
    document.querySelector('.dialog-bg').style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '17px';
  })
  document.querySelector('#unable-dialog-close').addEventListener('click',function(){
    document.querySelector('.dialog-bg').style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  })
  document.querySelector('#signin-switch-btn').addEventListener('click',function(){
    if (this.innerHTML == '手机验证码登录') {
      document.querySelector('#groupinputs-loginbypwd').style.display = 'none';
      document.querySelector('#groupinputs-loginbymesg').style.display = 'block';
      document.querySelector('#unable-login').style.display = 'none';
      this.innerHTML = '密码登录（手机号或邮箱）';
    }else{
      document.querySelector('#groupinputs-loginbymesg').style.display = 'none';
      document.querySelector('#groupinputs-loginbypwd').style.display = 'block';
      document.querySelector('#unable-login').style.display = 'block';
      this.innerHTML = '手机验证码登录';
    }
  })
};