window.onload = function(){
  var bannerpics = document.querySelectorAll('.banner-pic');
  var bannerbtns = document.querySelectorAll('.banner-btns li');
  var arrowleft = document.querySelector('.banner-arrow-left');
  var arrowright = document.querySelector('.banner-arrow-right');
  function bannerPicAddToBtn(){
    for (var i = bannerpics.length - 1; i >= 0; i--) {
      if (bannerpics[i].style.opacity == '1') {
        bannerbtns[i].classList.add('banner-btn-now');
      }else {
        bannerbtns[i].classList.remove('banner-btn-now');
      }
    }
  }
  function bannerBtnHover(){
    for (var i = bannerbtns.length - 1; i >= 0; i--) {
      (function(k){
        bannerbtns[k].onmouseover = function(){
          for (var i = bannerpics.length - 1; i >= 0; i--) {
            bannerpics[i].style.opacity = '0';
          }
          this.style.cursor = 'pointer';
          bannerpics[k].style.opacity = '1';
          bannerPicAddToBtn();
        }
      })(i);
    }
  }
  function bannerLeftArrow(){
    for (var i = bannerpics.length - 1; i >= 0; i--) {
      if (bannerpics[i].style.opacity == '1' && i != 0) {
        bannerpics[i].style.opacity = '0';
        bannerpics[i-1].style.opacity = '1';
        break;
      }else if (bannerpics[i].style.opacity == '1' && i == 0) {
        bannerpics[i].style.opacity = '0';
        bannerpics[bannerpics.length-1].style.opacity = '1';
        break;
      }
    }
    bannerPicAddToBtn();
  }
  function bannerRightArrow(){
    for (var i = bannerpics.length - 1; i >= 0; i--) {
      if (bannerpics[i].style.opacity == '1' && i != bannerpics.length-1) {
        bannerpics[i].style.opacity = '0';
        bannerpics[i+1].style.opacity = '1';
        break;
      }else if (bannerpics[i].style.opacity == '1' && i == bannerpics.length-1) {
        bannerpics[i].style.opacity = '0';
        bannerpics[0].style.opacity = '1';
        break;
      }
    }
    bannerPicAddToBtn();
  }
  function bannerArrow(){
    arrowleft.addEventListener('click',bannerLeftArrow);
    arrowright.addEventListener('click',bannerRightArrow);
    var bannerauto = setInterval(bannerRightArrow,7000);
  }
  bannerBtnHover();
  bannerArrow();
}