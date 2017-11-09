function lazyLoad (images) {
  const imgs = Array.from(images || document.querySelectorAll('img'))

  let onScroll = throttle (function () {
    if (!imgs.length) return window.removeEventListener('scroll', onScroll)

    const lazyimages = imgs.filter(img => img.matches('.lazyload'))

    lazyimages.forEach(img => {
      if (inVP(img)) onLoad(img)
    })
  }, 500)

  window.addEventListener('scroll', onScroll)
  window.dispatchEvent(new Event('scroll'))

  function inVP (img) {
    const {top, right, bottom, left} = img.getBoundingClientRect()
    const vH = document.documentElement.clientHeight
    const vW = document.documentElement.clientWidth

    return !(top > vH || bottom < 0 || left > vW || right < 0)
  }

  function onLoad (img) {
    const newimg = new Image()
    newimg.src = img.dataset.src
    newimg.onload = () => {
      img.src = newimg.src
      img.classList.remove('lazyload')
    }
  }

  function throttle (func, time) {
    let prev, timer

    return function fn() {
      const curr = new Date()
      const pass = curr - prev

      if (!prev || pass >= time) {
        func()
        prev = curr
      }else {
        clearTimeout(timer)
        timer = setTimeout(fn, time - pass)
      }
    }
  }
}
