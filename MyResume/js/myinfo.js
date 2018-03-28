class MyInfo {
  constructor (el, obj) {
    this.$el = el
    this.obj = obj
  }
  showme () {
    let txt = `<h1>个人简介：</h1>
      <p>姓名：<span>${this.obj.name}</span></p>
      <p>年龄：<span>${this.obj.age}</span></p>
      <p>性别：<span>${this.obj.sex}</span></p>
      <p>2016年7月毕业于 <span>${this.obj.school}</span></p>
      <p>所习专业：<span>${this.obj.major}</span></p>
      <p>QQ：<a href="tencent://message/?uin=1145192310">${this.obj.QQ}</a></p>
      <p>TEL：<a href="tel:18860913014">${this.obj.tel}</a></p>
      <p>自我评价: <a id="rsrx">${this.obj.pj}</a></p>`
    this.$el.innerHTML = txt
  }
}