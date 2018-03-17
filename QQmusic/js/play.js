function playSong(songid, albummid, songname, singer) {
  const $h5audio = document.querySelector('#h5audio-play')
  const $player = document.querySelector('#song-play')
  const $playicon = $player.querySelector('.play-icon')
  const $totaltime = $player.querySelector('.js-time-total')
  const $currtime = $player.querySelector('.js-time-calc')
  const $progressbar = $player.querySelector('.progress-bar .greenbar')
  const $downloadbtn = $player.querySelector('.down-thissong')
  const $lycbox = $player.querySelector('.song-lyrics-text')
  const $lycloading = $player.querySelector('.lyc-loading')
  const $songname = $player.querySelector('.song-info-flex h1')
  const $singer = $player.querySelector('.song-info-flex p')
  const $songimg = $player.querySelector('.song-info img')
  const $songbg = $player.querySelector('.song-bg')
  
  if (!$h5audio.duration) {
    renderDots()
    $lycloading.innerHTML = `歌曲链接貌似出问题了，请返回重试~`
  }
  if ($h5audio.dataset.event === 'false') addEvent()
  $h5audio.addEventListener('canplay', renderAll)  

  function renderAll () {
    $lycbox.innerHTML = ''
    $lycbox.style.transform = `translateY(0)`
    $lycloading.style.display = 'block'
    const run_progressbar = setInterval(() => {
      if ($h5audio.paused) return;
      $currtime.innerText = formatTime($h5audio.currentTime) 
      $progressbar.style.transform = `translateX(-${(1 - $h5audio.currentTime / $h5audio.duration)*100}%)`
    }, 200)
    renderDots()
    renderLyrics()
    $h5audio.removeEventListener('canplay', renderAll)
  }

  function renderDots () {
    $('.play-icon').removeClass('fa-play-circle-o').addClass('fa-pause-circle-o')
    $totaltime.innerText = formatTime($h5audio.duration)
    $songname.innerText = songname
    $singer.innerText = singer
    $songimg.src = `https://y.gtimg.cn/music/photo_new/T002R150x150M000${albummid}.jpg`
    $songbg.style.backgroundImage = `url(https://y.gtimg.cn/music/photo_new/T002R150x150M000${albummid}.jpg)`
  }

  function renderLyrics () {
    let currP = 0
    fetch(LYRICS_URL + songid)
        .then(res => res.json())
        .then(json => formatLyrics(json.lyric))
        .then(Lyc => {
          render(Lyc)
          running(Lyc)
        })
        .catch(() => failureTip())

    function running (lyc) {
      const $ps = $lycbox.querySelectorAll('p')
      $ps[0].classList.add('current-item')
      clearInterval(run_lyrics)
      run_lyrics = setInterval(() => {
        if ($h5audio.paused) return;
        for (let i = 0; i < lyc.length; i++) {
          const currtime = $h5audio.currentTime
          if (i === lyc.length - 1 && currtime >= isnumberTime(lyc[i][0])) {
            $ps[currP].classList.remove('current-item')
            $ps[i].classList.add('current-item')
            currP = i
            $lycbox.style.transform = `translateY(-${(lyc.length - 6) * 42}px)`
          }
          else if (currtime >= isnumberTime(lyc[i][0]) && currtime < isnumberTime(lyc[i+1][0])) {
            $ps[lyc.length - 1].classList.remove('current-item')
            $ps[currP].classList.remove('current-item')
            $ps[i].classList.add('current-item')
            if (currP < 2) {
              return currP = i;
            }else if (currP >= lyc.length - 3) {
              currP = i
              $lycbox.style.transform = `translateY(-${(lyc.length - 6) * 42}px)`
              break;
            }else {
              currP = i
              $lycbox.style.transform = `translateY(-${(i - 2) * 42}px)`
              break;
            }
            
          }
        }
      }, 50)
    }

    function render (lyc) {
      const html = lyc.map(item => `<p>${item[1]}</p>`).join('') 
      $lycloading.style.display = 'none'
      document.querySelector('div.song-lyrics-text').innerHTML = html
    }

    function failureTip () {
      $lycloading.innerHTML = `获取歌词失败 请点击 <a onclick="location.reload()" style="text-decoration: underline;">刷新</a> 重试`
    }
  }
  
  function addEvent () {
    document.querySelector('#song-play').addEventListener('click', function (e) {
      const T = e.target
      switch (true) {
        case T.matches('.fa-play-circle-o') :
          T.classList.remove('fa-play-circle-o')
          T.classList.add('fa-pause-circle-o')
          if ($h5audio.src) $h5audio.play()
          break;
        case T.matches('.fa-pause-circle-o') :
          T.classList.remove('fa-pause-circle-o')
          T.classList.add('fa-play-circle-o')
          if ($h5audio.src) $h5audio.pause()
          break;
        case T.matches('.fa-list') : 
          this.style.transform = 'rotate(90deg)'
          document.body.classList.remove('noscroll')
          break;
        case T.matches('.down-thissong') : 
          T.download = `${songname} - ${singer}`
          T.href = $h5audio.src
          break;
        default:
          break;
      }
    })

    $h5audio.addEventListener('ended', function () {
      this.play()
    })

    $h5audio.dataset.event = 'true'
  }

  function formatLyrics (lyc) {
    const arry = []
    const divT = document.createElement('div')
    divT.innerHTML = lyc
    divT.innerText.replace(/\[\d{2}:\d{2}\.\d{2}\]\n/g,'').match(/\[\d{2}:\d{2}\.\d{2}\].*/g).forEach(item=>{
      if (item.match(/(\[.+\])(.*)/)[2] === '') return;
      arry.push([item.match(/(\[.+\])(.*)/)[1], item.match(/(\[.+\])(.*)/)[2]])
    })
    return arry;
  }

  function formatTime (time) {
    let minutes = Math.floor(Math.round(time) / 60)
    let seconds = Math.floor(Math.round(time) % 60)

    minutes = minutes > 9 ? ''+minutes : '0'+minutes
    seconds = seconds > 9 ? ''+seconds : '0'+seconds

    return minutes + ':' + seconds
  }

  function isnumberTime (time) {
    const rz = time.match(/\[(\d{2}):(.+)\]/)
    const minutes = Number(rz[1])
    const seconds = Number(rz[2])

    return minutes * 60 + seconds
  }
}