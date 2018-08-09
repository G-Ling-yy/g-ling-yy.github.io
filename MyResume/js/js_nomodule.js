class Gradient {
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

class Cube {
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

class Build_3D {
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
      <p>QQ：<a href="tencent://message/?uin=${this.obj.QQ}">${this.obj.QQ}</a></p>
      <p>TEL：<a href="tel:18860913014">${this.obj.tel}</a></p>
      <p>自我评价: <a id="rsrx">${this.obj.pj}</a></p>`
    this.$el.innerHTML = txt
  }
}

const Myobj = {
  init_pi () {
    //我的信息对象
    const me_obj = {name: '高大全', sex: '男', age: 24, school: '苏州市职业大学',major: '软件技术', aim: '前端实习工作', QQ: 934830721, tel: 18860913014, pj: '本人性格开朗、稳重、有活力、待人热情、真诚。有较强的团队协作精神，较好的社交能力，善于处理各种人际关系。能尽快适应各种环境并融入其中。能把企业财富当作自身财富，在努力为企业服务的过程中实现自身价值。'}
    //信息对象渲染指定DOM
    let info = new MyInfo(document.querySelector('#myinfo'), me_obj)
    info.showme()
    //为指定aDOM添加事件
    const a_hp = document.querySelector('#rsrx') 
    const a_pd = document.querySelector('#more')
    aevent()
    //实例化一个3D对象，使全局变成三棱柱形状
    let build_3d = new Build_3D(document.querySelector('main'))
    build_3d.build()
    build_3d.change()
    function aevent () {
      a_hp.addEventListener('click', () => location.hash = `hp_sec`)
      a_pd.addEventListener('click', () => location.hash = `pd_sec`)
    }
  },
  init_hp () {
    const txt = `<p>炽焰如火似你的热情一鼓作气</p><p>盈盈如原像你的待人亲和如春</p><p>坚毅如刚是你的原则不可动摇</p><p>人生如水随波逐流</p><p>流过这里途径那里</p><p>磨平了棱角洗涤了灵魂</p><p>黑夜般无边无际是你的极限</p><p>白昼样光芒万丈是你的另一个极限</p><p>人生五彩人生百味</p><p>怎仅五彩岂止百味</p><p>转啊转啊看啊看啊</p><p>想啊想啊盼啊盼啊</p><p>什么都没有</p><p>真的什么都没有</p><p>竟真是什么都没有</p><p>呵</p><p>人生如戏</p><p>很看运气</p><p>愿你我好运</p><p>GoodLuck~</p>`
    document.querySelector('#goodluck').innerHTML = txt
    const $ps = document.querySelectorAll('#luck p')
    //为指定P元素添加事件函数执行
    psevent()
    //通过实例化对象使得hp_sec页面文字颜色渐变
    let words = new Gradient(document.querySelector('#goodluck'), 2, 7000)
    words.start()
    function psevent () {
      $ps[0].addEventListener('click', () => {location.hash = `pd_sec`})
      $ps[1].addEventListener('click', () => {location.hash = `pi_sec`})
    }
  },
  init_pd () {
    const $demos = document.querySelector('#demos')
    const demos_array = [
    {name: `QQmusic(仿)`, function: `推荐, 轮播, 排行榜, 歌曲搜索, 歌曲播放, 歌词同步`, skill: `sass, setTimeout(), setInterval(), .map(), .bind(), lazyload()懒加载, throttle节流, fetch(), switch···case, localStorage, matches, audio, RegExp`, url: `https://g-ling-yy.github.io/QQmusic/`, codeurl: `https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/QQmusic`}, 
    {name: `Github User Finder`, function: `根据名字查找Github用户基本信息`, skill: `debounce, await async promise, `, url: `https://g-ling-yy.github.io/MyTask_29/`, codeurl: `https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_29`}, 
    {name: `Ajax`, function: `通过ajax对数据进行增删改除等操作`, skill: `ajax get, ajax post, ajax put, ajax delete`, url: `https://g-ling-yy.github.io/MyTask_25/`, codeurl: `https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_25`}, 
    {name: `note`, function: `简易便签，记录数据并保存在本地localStorage, 更改外观主题`, skill: `sass, handleEvent, localStorage, switch···case, @media`, url: `https://g-ling-yy.github.io/MyTask_22/`, codeurl: `https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_22`}, 
    {name: `calculator`, function: `简易功能的计算器`, skill: `flex, sass, for···of, eval()`, url: `https://g-ling-yy.github.io/MyTask_19/`, codeurl: `https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_19`}, 
    {name: `array`, function: `展示数组基本方法`, skill: `animation, classList, Dom node, Math, push(), reduce(), split(), filter(), find()`, url: `https://g-ling-yy.github.io/MyTask_15/`, codeurl: `https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_15`}, 
    {name: `string`, function: `展示字符串基本方法`, skill: `transition, Date(), replace(), repeat(), indexOf(), match()`, url: `https://g-ling-yy.github.io/MyTask_14/`, codeurl: `https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_14`}, 
    {name: `sass`, function: `跑马灯图片展示`, skill: `sass, perspective, preserve-3d, animation`, url: `https://g-ling-yy.github.io/MyTask_12/`, codeurl: `https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_12`}, 
    {name: `3D`, function: `一些3D小效果`, skill: `perspective, preserve-3d, flex, transform`, url: `https://g-ling-yy.github.io/MyTask_8/`, codeurl: `https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_8`}]
    //渲染项目内容
    render($demos, demos_array)
    function render (dom, arr) {
      arr.forEach(ele => {
        dom.innerHTML += `<div class="demo">
          <h1>${ele.name}</h1>
          <p>功能概要：<span>${ele.function}</span></p>
          <p>技术要点：<span>${ele.skill}</span></p>
          <p>实例链接：<a href="${ele.url}" target="_blank.">${ele.url}</a></p>
          <p>Github源码：<a href="${ele.codeurl}" target="_blank"></a></p>
        </div>`
      })
    }
    //为指定P元素添加点击事件
    document.querySelector('section.pd_sec').addEventListener('click', function (e) {
      const target = e.target
      if (target.matches('.demo p span')) {
        const eleP = target.parentNode
        if (!eleP.style.overflow || eleP.style.overflow === 'hidden') {
          eleP.style.overflow = 'initial'
          eleP.style.whiteSpace = 'normal'
        } else {
          eleP.style.overflow = 'hidden'
          eleP.style.whiteSpace = 'nowrap'
        }
      } else if (target.matches('a.toleft') || target.matches('a.toright')) {
        target.matches('a.toleft') ? location.hash = 'pi_sec' : location.hash = 'hp_sec'
      }
    })
  },
  init () {
    this.init_pi()
    this.init_hp()
    this.init_pd()
  }
}
Myobj.init()