function renderRecom() {
  fetch(RECOMMED_URL)
  .then(res => res.json())
  .then(json => {
    //渲染slider图片
    sliderRender(json)

    //渲染radio图片
    renderRadio(json)

    //图片懒加载
    lazyLoad()

    //实例化slider类
    let sliders = [];
    document.querySelectorAll('div.recom-banner').forEach((item) => sliders.push(item))
    new Slider(sliders,3000)      
  })    

  function sliderRender(json) {
    var sliderhtml = '';
    for(let i = 0; i < 5; i++){
      let sliderhtmlp = (i===0) ? `<div class="recom-banner" style="opacity: 1"><a href="${json.data.slider[i].linkUrl}"><img src="${json.data.slider[i].picUrl}"></a></div>` : `<div class="recom-banner" style="opacity: 0"><a href="${json.data.slider[i].linkUrl}"><img src="${json.data.slider[i].picUrl}"></a></div>`;
      sliderhtml += sliderhtmlp;
    }
    document.querySelector('div.slider').innerHTML = sliderhtml;
  }

  function renderRadio(json) {
    const imgs = document.querySelectorAll('.div-radio .tworadios img')
    const ps = document.querySelectorAll('.div-radio .tworadios p')
    imgs.forEach((item, i) => {
      item.dataset.src = `${json.data.radioList[i].picUrl}`
    })
    ps.forEach((item, i) => {
      item.innerText = `${json.data.radioList[i].Ftitle}`
    })

    equalHeight()
  }
}