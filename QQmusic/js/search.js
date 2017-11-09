function renderHotkey() {
  fetch(HOTKEY_URL)
    .then(res => res.json())
    .then(json => render(json))

  function render(json) {
    const parentEle = document.querySelector('#hot-key .result-tags');
    parentEle.innerHTML = `<a href="${json.data.special_url}" class="tag-hot">${json.data.special_key}</a>`;
    
    try {
      json.data.hotkey.sort((a, b) => {return b.n - a.n}).forEach(item => {
        if (parentEle.clientHeight <= 126) {
          parentEle.innerHTML += `<a href="javascript:;">${item.k}</a>`
        }else {
          parentEle.removeChild(parentEle.lastElementChild)
          throw Error();
        }
      })
    } catch (e) {}
  }
}

function clickSearch() {
  const $search_page = document.querySelector('#section-search')
  const $cancel_btn = $search_page.querySelector('#cancel-btn')
  const $hot_key = $search_page.querySelector('#hot-key')
  const $search_input = $search_page.querySelector('#search-input')
  const $focus_wrapper = $search_page.querySelector('#focus-wrapper')
  const $search_content = $focus_wrapper.querySelector('ul.search_content')
  const $search_history = $search_page.querySelector('.history-records')
  const $loading = $focus_wrapper.querySelector('.loading-block')
  const $loaded = $focus_wrapper.querySelector('.load-complete')
  let curr_page = 1
  let curr_songmid

  backPrimary()
  
  $search_page.addEventListener('click', function(e){
    let T = e.target;
    switch (true) {
      case T.matches('#search-input') :
        if (T.value.length !== 0) return;
        $hot_key.style.display = 'none'
        $cancel_btn.style.display = 'block'
        $focus_wrapper.style.display = 'none'
        getLocalRecord()
        equalHeight()
        break;
      case T.matches('#cancel-btn') :
        backPrimary()
        break;
      case T.matches('svg') || T.parentElement.matches('svg') :
        $search_input.value = ''
        T.matches('svg') ? T.style.display = 'none' : T.parentElement.style.display = 'none'
        $focus_wrapper.style.display = 'none'
        $loaded.style.display = 'none'
        $search_history.style.display = 'block'
        equalHeight()
        break;
      case T.matches('p.clear-records') || T.parentElement.matches('p.clear-records') :
        clearHistory()
        break;
      case T.matches('#hot-key .result-tags a') :
        if (T.matches('.tag-hot')) return;
        const txt = T.innerText
        $search_input.value = txt
        renderSearchList(txt)
        addLocalRecord(txt)
        break;
    }
  })

  $search_input.addEventListener('keyup', function(e) {
    if (this.value.length === 0) return $search_page.querySelector('svg').style.display = 'none'
    else $search_page.querySelector('svg').style.display = 'block'
    if (e.keyCode === 13) {
      if (this.value.trim() === '') return this.value = ''
      this.value = this.value.trim()
      renderSearchList(this.value)
      addLocalRecord(this.value)
    }
  })

  function listToPlay() {
    const $search_items = $search_content.querySelectorAll('li')

    $search_items.forEach((item, i) => {
      item.addEventListener('click', function() {
        if (item.dataset.singermid) return location.href = `https://y.qq.com/w/singer.html?singermid=${item.dataset.singermid}`
        document.querySelector('#song-play').style.transform = 'rotate(0deg)'
        document.body.classList.add('noscroll')
        if (item.dataset.songmid === curr_songmid) return;
        curr_songmid = item.dataset.songmid
        document.querySelector('#h5audio-play').src = 
        `http://ws.stream.qqmusic.qq.com/${item.dataset.songid}.m4a?fromtag=46`
        playSong(`${item.dataset.songid}`, `${item.children[0].dataset.albummid}`, `${item.children[1].innerText}`, `${item.children[2].innerText}`)
      })
    })
  }
  
  function historyToSearch () {
    let $history_item_as = $search_history.querySelectorAll('ul > li a')
    $history_item_as.forEach(item => {
      item.addEventListener('click', function(e){
        let T = e.target
        if (T.matches('i.fa-times')) {
          let i = [].indexOf.call($search_history.querySelectorAll('ul li'), T.parentElement.parentElement)
          removeLocalRecord(i)
          $search_history.querySelector('ul').removeChild(T.parentElement.parentElement)
          return;
        }
        $search_input.value = this.children[1].innerText
        $search_history.style.display = 'none'
        renderSearchList($search_input.value)
      })
    })
  }

  function renderSearchList (value) {
    document.querySelector('.input-wrap svg').style.display = 'block'
    document.querySelector('#song-play').style.display = 'block'
    $focus_wrapper.style.display = 'block'
    $cancel_btn.style.display = 'block'
    $hot_key.style.display = 'none'
    $search_history.style.display = 'none'
    $search_content.innerText = ''

    loading(true)

    fetch(SEARCH_URL + value)
      .then(res => res.json())
      .then(json => {
        if (json.data.zhida.singermid) firstRender(json)
        render(json)
        loading(false)
        equalHeight()
      })
      .catch(() => failureTip())

    addEventListener('scroll', onscroll)

    function onscroll() {
      const max_height = document.body.clientHeight - innerHeight - 40
      const scrollTop = pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (max_height <= scrollTop) {
        removeEventListener('scroll', onscroll)
        loading(true)
        fetch(`${SEARCH_URL}${value}&page=${curr_page+=1}`)
          .then(res => res.json())
          .then(json => {
            render(json)
            loading(false)
            if (json.message === 'no results') done()
            equalHeight()
          })
        addEventListener('scroll', onscroll)
      }
    }
    
    function firstRender(json) {
      $search_content.innerHTML = 
      `<li data-singermid="${json.data.zhida.singermid}">
        <img src="https://y.gtimg.cn/music/photo_new/T001R68x68M000${json.data.zhida.singermid}.jpg">
        <h4>${json.data.keyword}</h4>
        <p><span>单曲：${json.data.zhida.songnum}</span><span>专辑：${json.data.zhida.albumnum}</span></p>
      </li>`;
    }

    function render(json) {
      json.data.song.list.forEach(item => {
        $search_content.innerHTML += 
        `<li data-songmid="${item.songmid}" data-songid="${item.songid}">
          <i class="music-icon" data-albummid="${item.albummid}"></i>
          <h4>${item.songname}</h4>
          <p>${item.singer.map(item=>{ return item.name}).join(' / ')}</p>
        </li>`;
      })

      listToPlay()
    }

    function loading(b) {
      if (!!b) $loading.style.display = 'flex'
      else {$loading.style.display = 'none'}
      equalHeight()
    }

    function done() {
      $loaded.style.display = 'block'
      removeEventListener('scroll', onscroll)
    }

    function failureTip () {
      $loading.innerHTML = `<p>获取数据失败 请点击 <a onclick="location.reload()" style="text-decoration: underline;">刷新</a> 重试</p>`
    }
  }

  function getLocalRecord () {
    let keyword = localStorage.getItem('myQQMusic-history') || ''
    if (!keyword) return $search_history.style.display = 'none';
    if ($search_history.style.display === 'block') return;
    $search_history.style.display = 'block'
    $search_history.querySelector('ul').innerHTML = ''
    keyword.split(',').forEach(item => {
      $search_history.querySelector('ul').innerHTML += 
      `<li>
        <a href="javascript:;" class="js-search-keyword">
          <img src="images/clock_ic.png">
          <p>${item}</p>
          <i class="fa fa-times"></i>
        </a>
      </li>`
    })
    historyToSearch()
  }

  function removeLocalRecord (i) {
    let oldkeywords = localStorage.getItem('myQQMusic-history')
    let newkeywords = oldkeywords.split(',')
    newkeywords.splice(i,1)
    localStorage.setItem('myQQMusic-history', newkeywords)
    if (!newkeywords.length) $search_history.style.display = 'none'
  }

  function addLocalRecord (txt) {
    let oldkeywords = localStorage.getItem('myQQMusic-history') || ''
    let newkeywords = oldkeywords.split(',')
    if (newkeywords.some(item => item === txt)) return;
    newkeywords[0] === '' ? newkeywords[0] = txt : newkeywords.push(txt)
    localStorage.setItem('myQQMusic-history', newkeywords)
  }

  function clearHistory () {
    localStorage.setItem('myQQMusic-history', '')
    getLocalRecord()
  }

  function backPrimary () {
    $search_input.value = ''
    $hot_key.style.display = 'block'
    $cancel_btn.style.display = 'none'
    $focus_wrapper.style.display = 'none'
    $search_history.style.display = 'none'
    $loaded.style.display = 'none'
    $search_input.parentElement.querySelector('svg').style.display = 'none'
  }
}