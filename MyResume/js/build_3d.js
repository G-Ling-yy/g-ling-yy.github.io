class Build_3D {
  constructor (el) {
    this.$el = el
    this.secs = this.$el.querySelectorAll('section')
    location.hash = `pi_sec`
    !!localStorage.getItem('usinghash') ? location.hash = JSON.parse(localStorage.getItem('usinghash')).hash : ''
    localStorage.setItem('usinghash', JSON.stringify({hash:'pi_sec', angle:-120}))
    onresize = () => this.build()
  }
  build () {
    let w = document.documentElement.clientWidth || document.body.clientWidth
    let num = w * .01444
    this.secs[0].style.transform = `rotateY(0) translateZ(${num}rem)`
    this.secs[1].style.transform = `rotateY(240deg) translateZ(${num}rem)`
    this.secs[2].style.transform = `rotateY(120deg) translateZ(${num}rem)`
  }
  change () {
    window.addEventListener('hashchange', () => {
      let obj = JSON.parse(localStorage.getItem('usinghash'))
      let newhash = location.hash.slice(1)
      if (obj.hash === newhash) return
      switch (newhash) {
        case 'hp_sec' :
          this.secs[0].style.display = 'block'
          obj.hash === 'pd_sec' ? this.$el.style.transform = `rotateY(${obj.angle - 120}deg)` : this.$el.style.transform = `rotateY(${obj.angle + 120}deg)`
          obj.hash === 'pd_sec' ? obj.angle = obj.angle - 120 : obj.angle = obj.angle + 120
          obj.hash === 'pd_sec' ? setTimeout(() => this.secs[1].style.display = 'none', 1700) : setTimeout(() => this.secs[2].style.display = 'none', 1700)
          obj.hash = newhash
          localStorage.setItem('usinghash', JSON.stringify(obj))
          break
        case 'pd_sec' : 
          this.secs[1].style.display = 'block'
          setTimeout(() => this.secs[0].style.display = 'none', 1700)
          obj.hash === 'pi_sec' ? this.$el.style.transform = `rotateY(${obj.angle - 120}deg)` : this.$el.style.transform = `rotateY(${obj.angle + 120}deg)`
          obj.hash === 'pi_sec' ? obj.angle = obj.angle - 120 : obj.angle = obj.angle + 120
          obj.hash === 'pi_sec' ? setTimeout(() => this.secs[2].style.display = 'none', 1700) : setTimeout(() => this.secs[0].style.display = 'none', 1700)
          obj.hash = newhash
          localStorage.setItem('usinghash', JSON.stringify(obj))
          break
        case 'pi_sec' :
          this.secs[2].style.display = 'block'
          obj.hash === 'hp_sec' ? this.$el.style.transform = `rotateY(${obj.angle - 120}deg)` : this.$el.style.transform = `rotateY(${obj.angle + 120}deg)`
          obj.hash === 'hp_sec' ? obj.angle = obj.angle - 120 : obj.angle = obj.angle + 120
          obj.hash === 'hp_sec' ? setTimeout(() => this.secs[0].style.display = 'none', 1700) : setTimeout(() => this.secs[1].style.display = 'none', 1700)
          obj.hash = newhash
          localStorage.setItem('usinghash', JSON.stringify(obj))
          break
        default :
          return location.hash = obj.hash
      }
    })
  }
}