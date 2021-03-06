import {Gradient} from './gradient.js'
export class Cube {
  constructor (el, swidth) {
    this.$el = el
    this.swidth = swidth
    this.$faces = []
  }
  createDoms () {
    this.$container = document.createElement('div')
    this.$container.className = `cube_container`
    this.$el.appendChild(this.$container)
    for (let i = 0; i < 6; i++) {
      let newface = document.createElement('div')
      newface.className = `cube_face`
      this.$container.appendChild(newface)
      this.$faces.push(newface)
    }
  }
  colorCube () {
    if (!arguments.length) return;
    let args = Array.from(arguments)
    if (args.length > 5) args = args.slice(0,5)
    this.$faces.forEach((ele, i) => {
      ele.style.backgroundColor = args[i]
    })
    let lastface = new Gradient(this.$faces[5], 1, 2700)
    lastface.start()
  }
}