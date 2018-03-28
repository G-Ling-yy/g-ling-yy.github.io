const Myobj = {
  init_pi () {
    //我的信息对象
    const me = {name : '高大全', sex : '男', age : 24, school : '苏州市职业大学',major : '软件技术', aim : '前端实习工作', QQ : 934830721, tel : 18860913014, pj: '智商低，反应慢，运气还特么差'}
    //信息对象渲染指定DOM
    let info = new MyInfo(document.querySelector('#myinfo'), me)
    info.showme()
    //为指定aDOM添加事件
    const a_hp = document.querySelector('#rsrx') 
    const a_pd = document.querySelector('#more p a')
    aevent()
    function aevent () {
      a_hp.addEventListener('click', () => location.hash = `hp_sec`)
      a_pd.addEventListener('click', () => location.hash = `pd_sec`)
    }
  },
  init_hp () {
    const ps = document.querySelectorAll('#luck p')
    //为指定P元素添加事件函数执行
    psevent()
    //实例化一个3D对象，使全局变成三棱柱形状
    // let build_3d = new Build_3D(document.querySelector('main'))
    // build_3d.build()
    // build_3d.change()
    //实例化一个cube对象，在body里添加dom
    let cube = new Cube(document.querySelector('#cube'))
    cube.createDoms()
    cube.colorCube('#f00', '#0f0', '#00f', '#fff', '#000')
    //通过实例化对象使得hp_sec页面文字颜色渐变
    let words = new Gradient(document.querySelector('#goodluck'), 2, 7000)
    words.start()
    function psevent () {
      ps[0].addEventListener('click', () => {location.hash = `pd_sec`})
      ps[1].addEventListener('click', () => {location.hash = `pi_sec`})
    }
  }
}
Myobj.init_pi()
Myobj.init_hp()