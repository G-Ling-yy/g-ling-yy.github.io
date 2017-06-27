window.onload = function(){
  var hnavlibtns = document.querySelectorAll('.header-nav li');
  var mainpots = document.querySelectorAll('main .point');
  function orderButtons(){
    document.querySelector('.header-nav').addEventListener('click',function(e){
      if (e.target.nodeName == 'LI') {
        for (var i = hnavlibtns.length - 1; i >= 0; i--) {
          hnavlibtns[i].classList.remove('header-ulli-checked');
        }
        e.target.classList.add('header-ulli-checked');
      }
    })
  }
  orderButtons();
  document.querySelector('.header-nav li:first-child').addEventListener('click',function(){
    mainpots[0].style.order = '1';
    mainpots[1].style.order = '0';
    mainpots[2].style.order = '-1';
  })
  document.querySelector('.header-nav li:nth-child(2)').addEventListener('click',function(){
    mainpots[0].style.order = '0';
    mainpots[1].style.order = '-1';
    mainpots[2].style.order = '0';
  })
  document.querySelector('.header-nav li:nth-child(3)').addEventListener('click',function(){
    mainpots[0].style.order = '1';
    mainpots[1].style.order = '-1';
    mainpots[2].style.order = '0';
  })
  document.querySelector('.header-nav li:last-child').addEventListener('click',function(){
    window.location.href = window.location.href;
  })
}