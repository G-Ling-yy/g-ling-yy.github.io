export class Gradient {
  constructor (el, pp, time) {
    this.$el = el
    this.pp = pp
    this.time = time
    this.$el.style.transition = `${this.time / 700}s`
  }
  start () {
    const eldom = this.$el
    setInterval(() => change(this.pp), this.time)
    function change (p) {
      let ary = []
      for (let i = 0; i < 3; i++) {
        ary.push(Math.ceil(Math.random() * 255))
      }
      ary.push(Math.ceil(Math.random() * 5 + 5) / 10)
      p === 1 ? eldom.style.backgroundColor = `rgba(${ary[0]}, ${ary[1]}, ${ary[2]}, ${ary[3]})` : eldom.style.color = `rgba(${ary[0]}, ${ary[1]}, ${ary[2]}, ${ary[3]})`
    }
  }
}