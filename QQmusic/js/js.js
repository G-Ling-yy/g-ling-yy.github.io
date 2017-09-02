(function(){
  function sliderRender(){
    var sliderhtml = '';
    for(let i = 0; i < 5; i++){
      let sliderhtmlp = (i===0) ? `<div class="recom-banner" style="opacity: 1"><a href="${slider_json.data.slider[i].linkUrl}"><img src="${slider_json.data.slider[i].picUrl}"></a></div>` : `<div class="recom-banner" style="opacity: 0"><a href="${slider_json.data.slider[i].linkUrl}"><img src="${slider_json.data.slider[i].picUrl}"></a></div>`;
      sliderhtml += sliderhtmlp;
    }
    document.querySelector('div.slider').innerHTML = sliderhtml;
  }
  sliderRender();

  var sliders = [];
  document.querySelectorAll('div.recom-banner').forEach((item)=>sliders.push(item));
  new Slider(sliders,2000);

  function navTab(){
    document.querySelector('header + nav').addEventListener('click', function(e){
      let data = e.target.dataset.nav;
      let content = document.querySelector('main .sections');
      switch (true) {
        case data==='recom':
          content.style.transform = 'translateX(0)' ;
          removecurr();
          e.target.classList.add('current');
          break;
        case data==='toplist':  
           content.style.transform = 'translateX(-100vw)' ;
           removecurr();
          e.target.classList.add('current');
           break;
        case data==='search':  
           content.style.transform = 'translateX(-200vw)' ;
           removecurr();
          e.target.classList.add('current');
           break;
      }
    });
    function removecurr(){
      document.querySelectorAll('header + nav > a').forEach(item=>item.classList.remove('current'));
    }
  }
  navTab();

  function renderRadio(){
    document.querySelector('div.div-radio').innerHTML +=
    `<div class="tworadios">
            <a href="javascript:;">
              <div>
                <img src="${slider_json.data.radioList[0].picUrl}">
              </div>
              <p>${slider_json.data.radioList[0].Ftitle}</p>
            </a><a href="javascript:;">
              <div>
                <img src="${slider_json.data.radioList[1].picUrl}">
              </div>
              <p>${slider_json.data.radioList[1].Ftitle}</p>
            </a>
          </div>`
  }
  renderRadio();

  renderToplist();



})()

