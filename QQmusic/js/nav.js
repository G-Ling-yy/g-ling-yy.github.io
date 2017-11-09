function navTab(){
  let recom_rendered = false
  let toplist_rendered = false
  let search_rendered = false
  document.querySelector('header + nav').addEventListener('click', function(e){
    let T = e.target
    let data = T.dataset.nav
    let content_recom = document.querySelector('#section-recom')
    let content_toplist = document.querySelector('#section-toplist')
    let content_search = document.querySelector('#section-search')
    switch (true) {
      case data === 'recom' :
        navEvent(content_recom, data, T)
        break;
      case data === 'toplist' :   
        navEvent(content_toplist, data, T)
        break;
      case data === 'search' :  
        navEvent(content_search, data, T)
        break;
    }
  })

  keepPage(location.hash.slice(1))

  function keepPage(currHash) {
    switch (true) {
      case currHash === 'recom' :
        document.querySelectorAll('header + nav > a')[0].click()
        break;
      case currHash === 'toplist' :
        document.querySelectorAll('header + nav > a')[1].click()
        break;
      case currHash === 'search' :
        document.querySelectorAll('header + nav > a')[2].click()
        break;
      default :
        document.querySelectorAll('header + nav > a')[0].click()
        break;
      }
  }

  function removeCurr(currElement, currSection) {
    document.querySelectorAll('header + nav > a').forEach(item=>item.classList.remove('current'))
    currElement.classList.add('current')
    document.querySelectorAll('main .sections section').forEach(item=>item.classList.remove('section-loaded'))
    currSection.classList.add('section-loaded')
  }

  function moveInterface(appointSection, newHash) {
    let oldSection = document.querySelector('.section-loaded')
    oldSection.classList.remove('section-loaded')
    appointSection.matches('.hidden-left') ? oldSection.classList.add('hidden-right') : oldSection.classList.add('hidden-left')
    appointSection.matches('.hidden-left') ? appointSection.classList.remove('hidden-left') : appointSection.classList.remove('hidden-right')
    appointSection.classList.add('section-loaded')
    location.hash = newHash
  }

  function navEvent(appointSection, newHash, appointElement) {
    let hashstring = location.hash.slice(1)
    if (appointSection.matches('#section-recom') && !recom_rendered) {
      renderRecom()
      recom_rendered = true
    }
    if (appointSection.matches('#section-toplist') && !toplist_rendered) {
      renderToplist()
      toplist_rendered = true
    }
    if (appointSection.matches('#section-search') && !search_rendered) {
      renderHotkey()
      clickSearch()
      search_rendered = true
    }
    if (hashstring === newHash && appointSection.matches('.section-loaded')) return;
    moveInterface(appointSection, newHash)
    removeCurr(appointElement, appointSection)
    lazyLoad()
    equalHeight()
  }

  window.addEventListener('hashchange', function(){keepPage(location.hash.slice(1))})
}
