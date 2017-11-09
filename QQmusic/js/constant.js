const RECOMMED_URL = 'https://qq-music-api.now.sh/'
const TOPLIST_URL = 'https://qq-music-api.now.sh/top/'
const HOTKEY_URL = 'https://qq-music-api.now.sh/hotkey/'
const SEARCH_URL = 'https://qq-music-api.now.sh/search?keyword='
const LYRICS_URL = 'https://qq-music-api.now.sh/lyrics?id='
let run_lyrics

const equalHeight = function() {
  document.querySelector('main .sections').style.height = document.querySelector('section.section-loaded').clientHeight + 'px'
}
