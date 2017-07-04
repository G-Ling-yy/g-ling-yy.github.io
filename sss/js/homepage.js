(function(){
  /*为main里面图片展示的按钮添加事件的函数companyPicShow()*/
  function companyPicShow(){
    /*左边按钮事件添加*/
    var leftbtns = document.querySelectorAll('.companypicbtns.companypicbtn-left');
    var companypics = document.querySelectorAll('.company-pic-show ul');
    for (var i = leftbtns.length - 1; i >= 0; i--) {
      (function(k){
        leftbtns[k].addEventListener('click',function(){
          if (companypics[k].style.left != '-18.54rem') {
            companypics[k].style.left = parseFloat(companypics[k].style.left)-6.18 + 'rem';
          }
        })
      })(i);
    }
    /*右边按钮事件添加*/
    var rightbtns = document.querySelectorAll('.companypicbtns.companypicbtn-right');
    for (var i = rightbtns.length - 1; i >= 0; i--) {
      (function(k){
        rightbtns[k].addEventListener('click',function(){
          if (companypics[k].style.left != '0rem') {
            companypics[k].style.left = parseFloat(companypics[k].style.left)+6.18 + 'rem';
          }
        })
      })(i);
    }
  }
  
  companyPicShow();
})();