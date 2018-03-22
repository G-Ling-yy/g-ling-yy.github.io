class Build_3D {
  constructor (el) {
    this.$el = el
    this.secs = this.$el.querySelectorAll('section')
    location.hash = `#hp_sec`
    localStorage.setItem('usinghash', JSON.stringify({hash:'hp_sec', angle:0}))
    this.oldhash = JSON.parse(localStorage.getItem('usinghash')).hash
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
      let newhash = location.hash.slice(1)
      if (this.oldhash === newhash) return
      let obj = JSON.parse(localStorage.getItem('usinghash'))
      switch (newhash) {
        case 'hp_sec' :
          this.oldhash === 'pd_sec' ? this.$el.style.transform = `rotateY(${obj.angle - 120}deg)` : this.$el.style.transform = `rotateY(${obj.angle + 120}deg)`
          this.oldhash === 'pd_sec' ? obj.angle = obj.angle - 120 : obj.angle = obj.angle + 120
          this.oldhash = newhash
          localStorage.setItem('usinghash', JSON.stringify(obj))
          break
        case 'pd_sec' :
          this.oldhash === 'pi_sec' ? this.$el.style.transform = `rotateY(${obj.angle - 120}deg)` : this.$el.style.transform = `rotateY(${obj.angle + 120}deg)`
          this.oldhash === 'pi_sec' ? obj.angle = obj.angle - 120 : obj.angle = obj.angle + 120
          this.oldhash = newhash
          localStorage.setItem('usinghash', JSON.stringify(obj))
          break
        case 'pi_sec' :
          this.oldhash === 'hp_sec' ? this.$el.style.transform = `rotateY(${obj.angle - 120}deg)` : this.$el.style.transform = `rotateY(${obj.angle + 120}deg)`
          this.oldhash === 'hp_sec' ? obj.angle = obj.angle - 120 : obj.angle = obj.angle + 120
          this.oldhash = newhash
          localStorage.setItem('usinghash', JSON.stringify(obj))
          break
        default :
          return location.hash = this.oldhash
      }
    })
  }
}

let build_3d = new Build_3D(document.querySelector('main'))
build_3d.build()
build_3d.change()