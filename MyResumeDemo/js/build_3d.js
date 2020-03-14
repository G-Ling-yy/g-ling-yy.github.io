import {Cube} from './cube.js'
export class Build_3D {
  constructor (el) {
    this.$el = el
    this.secs = this.$el.querySelectorAll('section')
      switch (location.hash.slice(1)) {
        case 'hp_sec' :
          this.$el.style.transform = `rotateY(120deg)`
          this.recording('hp_sec', 120)
          if (!document.querySelector('#cube .cube_container')) {
            let cube = new Cube(document.querySelector('#cube'))
            cube.createDoms()
            cube.colorCube('#f00', '#0f0', '#00f', '#fff', '#000')
          }
          break
        case 'pd_sec' :
          this.$el.style.transform = `rotateY(-120deg)`
          this.recording('pd_sec', -120)
          break
        case 'pi_sec' :
          this.$el.style.transform = `rotateY(0)`
          this.recording('pi_sec', 0)
          break
        default : 
          if (localStorage.getItem('usinghash'))  {
            this.$el.style.transform = `rotateY(${JSON.parse(localStorage.getItem('usinghash')).angle}deg)`
            location.hash = JSON.parse(localStorage.getItem('usinghash')).hash
          } else {
            this.$el.style.transform = `rotateY(0)`
            location.hash = `pi_sec`
            this.recording('pi_sec', 0)
          }
      }
    onresize = () => this.build()
  }
  build () {
    let w = innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let num = w * .01444
    this.secs[0].style.transform = `translateX(-100%) rotateY(-120deg)`
    this.secs[1].style.transform = `translateX(100%) rotateY(120deg)`
    this.$el.style.transformOrigin = `50% 50% -${num}rem`
  }
  change () {
    window.addEventListener('hashchange', () => {
      if (!localStorage.getItem('usinghash')) location.reload()
      let obj = JSON.parse(localStorage.getItem('usinghash'))
      let newhash = location.hash.slice(1)
      if (obj.hash === newhash) return
      switch (newhash) {
        case 'hp_sec' :
          if (!document.querySelector('#cube .cube_container')) {
            let cube = new Cube(document.querySelector('#cube'))
            cube.createDoms()
            cube.colorCube('#f00', '#0f0', '#00f', '#fff', '#000')
          }
          obj.hash === 'pd_sec' ? this.$el.style.transform = `rotateY(${obj.angle - 120}deg)` : this.$el.style.transform = `rotateY(${obj.angle + 120}deg)`
          obj.hash === 'pd_sec' ? obj.angle -= 120 : obj.angle += 120
          this.recording(newhash, obj.angle)
          break
        case 'pd_sec' : 
          obj.hash === 'pi_sec' ? this.$el.style.transform = `rotateY(${obj.angle - 120}deg)` : this.$el.style.transform = `rotateY(${obj.angle + 120}deg)`
          obj.hash === 'pi_sec' ? obj.angle = obj.angle - 120 : obj.angle = obj.angle + 120
          this.recording(newhash, obj.angle)
          break
        case 'pi_sec' :
          obj.hash === 'hp_sec' ? this.$el.style.transform = `rotateY(${obj.angle - 120}deg)` : this.$el.style.transform = `rotateY(${obj.angle + 120}deg)`
          obj.hash === 'hp_sec' ? obj.angle = obj.angle - 120 : obj.angle = obj.angle + 120
          this.recording(newhash, obj.angle)
          break
        default :
          return location.hash = obj.hash
      }
    })
  }
  recording (str, agl) {
    localStorage.setItem('usinghash', JSON.stringify({hash: str, angle: agl}))
  }
}