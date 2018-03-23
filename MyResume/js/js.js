const Myobj = {
  init_hp () {
    const ps = document.querySelectorAll('#luck p')
    //为指定P元素添加事件函数执行
    psevent()
    //实例化一个3D对象，使全局变成三棱柱形状
    let build_3d = new Build_3D(document.querySelector('main'))
    build_3d.build()
    build_3d.change()
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
Myobj.init_hp()