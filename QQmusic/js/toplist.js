function renderToplist() {
  fetch(TOPLIST_URL)
    .then(res => res.json())
    .then(json => {
      render(json)
      lazyLoad()
      equalHeight()
    })

  function render(json) {
    json.data.topList.forEach(item=>{
      let count = item.listenCount < 10000 ? item.listenCount : (item.listenCount / 10000).toFixed(1);
      document.querySelector('#section-toplist ul').innerHTML += 
      `<li>
        <a href="javascript:;" class="topic_media">
          <img class="lazyload" data-src="${item.picUrl}">
          <p><span>M</span>${count}万</p>
        </a>
        <div>
          <h3>${item.topTitle}</h3>
          <p>1<span>${item.songList[0].songname}</span>- ${item.songList[0].singername}</p>
          <p>2<span>${item.songList[1].songname}</span>- ${item.songList[1].singername}</p>
          <p>3<span>${item.songList[2].songname}</span>- ${item.songList[2].singername}</p>
          <i></i>
        </div>
      </li>`;
    })
  }

}