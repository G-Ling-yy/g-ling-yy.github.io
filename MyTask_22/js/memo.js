(function(){
  let memoapp = {
    localStorage_key: 'memonotes',
    localStorage_bg: 'bg',
    //初始化函数
    init(){
      this.$sf = document.querySelector('div.memopad');
      this.$sf.addEventListener('click',this);//memoapp对象作为事件监听器
      this.$mainV = document.querySelector('div.main-view');//主界面
      this.$notes = document.querySelector('div.notes')//便笺内容列表
      this.$contentV = document.querySelector('div.content-view');//编辑界面
      this.$setV = document.querySelector('div.setting-view');//设置界面
      this.$trashbtn = document.querySelector('i.fa.fa-trash.nav-btn-trash');//清空按钮
      this.$txtarea = document.querySelector('div.content-view-content textarea');//textarea元素
      if (!localStorage.getItem(this.localStorage_key)) {localStorage.setItem(this.localStorage_key,'[]')};//处理本地数据为空等异常情况
      this.notes = Array.isArray(JSON.parse(localStorage.getItem(this.localStorage_key))) ? JSON.parse(localStorage.getItem(this.localStorage_key)) : [];//notes属性获取本地数据或初始化
      this.selectedIndex = null;//选中便笺的index
      this.editStage = false;//判断是否是编辑状态
      this.colors = localStorage.getItem(this.localStorage_bg) ? JSON.parse(localStorage.getItem(this.localStorage_bg)) : null;//主标题色初始值
      if (!this.colors) {this.modifyRangeColor()};
      this.ftColor;//字体色
      this.render();
      if (innerWidth > 440) {
        this.betterScrollbar();
      }
    },
    //对象作为监听器一定要有handleEvent()方法
    handleEvent(e){
      let t = e.target;
      switch(true){
        case t.matches('i.fa-edit'):
          this.edit();
          break;
        case t.matches('i.fa-gear'):
          this.toSetting();
          break;
        case t.matches('i.fa-bars'):
          this.toMain();
          break;
        case t.matches('div.add-note') || t.matches('i.fa-plus'):
          this.toContent();
          break;
        case t.matches('i.fa-angle-left'):
          this.back();
          break;
        case t.matches('div.note') || t.parentElement.matches('div.note'):
          this.view(e);
          break;
        case t.matches('i.fa-trash'):
          this.trash();
          break;
        case t.matches('i.fa-thumbs-up'):
          alert('谢谢你给我点赞~');
      }
    },
    //跳转到设置界面
    toSetting(){
      this.$sf.classList.add('rotatememomain');
      this.$sf.classList.remove('rotatememosetting');
      this.rgbaRange();
    },
    //跳转到便笺主界面
    toMain(){
      this.$sf.classList.add('rotatememosetting');
      this.$sf.classList.remove('rotatememomain');
    },
    //跳转到编辑界面
    toContent(){
      this.$contentV.classList.remove('droppull-up');
      this.$contentV.classList.add('droppull-down');
      this.$txtarea.focus();
      this.$txtarea.addEventListener('keyup',function(){
        if (memoapp.$txtarea.value.length > 0 ) {
          memoapp.$trashbtn.style.visibility = 'visible';
        }else {
          memoapp.$trashbtn.style.visibility = 'hidden';
        }
      })
    },
    //返回到便笺主界面
    back(){
      if (this.selectedIndex === null && this.$txtarea.value.length > 0) {
        this.notes.push({text: this.$txtarea.value});
      }else if (this.selectedIndex !== null) {
        if (this.$txtarea.value.length > 0) {
          this.notes[this.selectedIndex].text = this.$txtarea.value;
        } else {
          this.notes.splice(this.selectedIndex,1);
        }
      }
      this.selectedIndex = null;
      this.$txtarea.value = '';
      this.save();
      this.render();
      this.$contentV.classList.remove('droppull-down');
      this.$contentV.classList.add('droppull-up');
    },
    //清空编辑器内容
    trash(){
      let yon = confirm('是否确认清空所有编辑内容？');
      if (!yon) {this.$txtarea.focus();return};
      this.$txtarea.value = '';
      this.$txtarea.focus();
    },
    //保存notes数据
    save(){
      localStorage.setItem(this.localStorage_key,JSON.stringify(this.notes));
      localStorage.setItem(this.localStorage_bg,JSON.stringify(this.colors));
    },
    //渲染便笺主界面
    render(){
      this.$notes.innerHTML = this.notes.map(function(item,i){
        return `<div class="note" data-index='${i}'><input type="checkbox" style="display: none;margin-right: .5rem;"><p>${item.text}</p></div>`;
      }).join('');
      this.initialRangeColor();
      this.modifyRangeColor();
    },
    //点击查看对应note
    view(e){
      var T = e.target.parentElement.matches('div.note')? e.target.parentElement:e.target;
      this.selectedIndex = T.dataset.index;
      if (!this.$editStage) {
        this.$txtarea.value = this.notes[this.selectedIndex].text;
        this.$trashbtn.style.visibility = 'visible';
        this.toContent();
      } else {
        var inputs = this.$notes.querySelectorAll('div.note input');
        inputs[this.selectedIndex].checked = inputs[this.selectedIndex].checked?false:true;
      }
    },
    //美化PC端的滚动条样式
    betterScrollbar(){
      var width = innerWidth - this.$notes.clientWidth;
      var sbc = this.$mainV.querySelector('div.scrollbar-cover');
      sbc.style.width = width+'px';
      this.$notes.addEventListener('scroll',function(){
        sbc.classList.remove('opacity-05');
        setTimeout(()=>sbc.classList.add('opacity-05'));
      });
    },
    //编辑便笺批量删除与保存
    edit(){
      var inputs = this.$notes.querySelectorAll('div.note input');
      var btns = this.$mainV.querySelectorAll('div.editbtns button');
      if (!this.$editStage) {
        this.$editStage = true;
        inputs.forEach((item,i) => {item.style.display = 'inline-block';});
        this.$sf.querySelector('div.add-note').hidden = true;
        document.querySelector('div.editbtns').style.height = '2rem'; 
        btns[0].addEventListener('click',function(){
          let TFarry = [];
          inputs.forEach((item,i)=>TFarry.push(item.checked));
          let allyes = TFarry.every((item) => item);
          inputs.forEach((item,i) => {if (!item.checked) item.checked = true;if (allyes) {item.checked = false}});
        });
        btns[1].addEventListener('click',function(){
          let TFarry = [];
          inputs.forEach((item,i)=>TFarry.push(item.checked));
          let allno = TFarry.every((item) => !item);
          if (allno) {alert('请先选择项再删除!');}
          else if (confirm('确定删除所有选中项？')) {
            inputs.forEach((item,i) => {if (item.checked) {memoapp.notes.splice(i,1)}});
            memoapp.$editStage = false;
            memoapp.$sf.querySelector('div.add-note').hidden = false;
            document.querySelector('div.editbtns').style.height = '0'; 
            inputs.forEach((item,i) => {item.checked = false});
            memoapp.save();
            memoapp.render();
          }
        });
      } else {
        this.$editStage = false;
        inputs.forEach((item,i) => {item.style.display = 'none';});
        this.$sf.querySelector('div.add-note').hidden = false;
        document.querySelector('div.editbtns').style.height = '0'; 
      }
    },
    //设置界面的range执行
    rgbaRange(){
      var ranges = this.$setV.querySelectorAll('.setting-content-block div input');
      ranges.forEach((item)=>{item.nextElementSibling.innerHTML = item.value});
      ranges.forEach((item)=>{item.addEventListener('change',function(){
        this.nextElementSibling.innerHTML = this.value;
      })});
    //  this.modifyColor();
      ranges.forEach((item)=>{item.addEventListener('change',function(){
        memoapp.modifyRangeColor();
      })});
    },
    //从本地获取数据并赋值给各个range
    initialRangeColor(){
      let ranges = this.$setV.querySelectorAll('.setting-content-block div input');
      let ztarry = this.colors.ztColor.slice(5,this.colors.ztColor.length-1).split(',');
      let btarry = this.colors.btColor.slice(5,this.colors.btColor.length-1).split(',');
      let ftarry = this.colors.ftColor.slice(5,this.colors.ftColor.length-1).split(',');
      for (let i = 3; i >= 0; i--) {
        ranges[i].value = ztarry[i];
      };
      for (let i = 7; i >=4; i--) {
        ranges[i].value = btarry[i-4];
      };
      for (let i = 11; i >=8; i--) {
        ranges[i].value = ftarry[i-8];
      }
    },
    //根据各个range的值修改页面并保存range值
    modifyRangeColor(){
      let ranges = this.$setV.querySelectorAll('.setting-content-block div input');
      let mainH = this.$mainV.querySelector('div.main-view-header');
      let setH = this.$setV.querySelector('div.setting-view-header');
      let contentH = this.$contentV.querySelector('div.content-view-header');
      let fas = this.$sf.querySelectorAll('i.fa');
      let notes = this.$mainV.querySelectorAll('div.note p');
      let textarea = this.$contentV.querySelector('textarea'); 
      let ps = this.$setV.querySelectorAll('div.setting-content-block p');
      let eles = [mainH,setH,contentH];
      this.colors = {ztColor: `rgba(${ranges[0].value},${ranges[1].value},${ranges[2].value},${ranges[3].value})`,btColor: `rgba(${ranges[4].value},${ranges[5].value},${ranges[6].value},${ranges[7].value})`,ftColor: `rgba(${ranges[8].value},${ranges[9].value},${ranges[10].value},${ranges[11].value})`};
      let tparry = [];
      for (item in this.colors) tparry.push(this.colors[item]);
      eles.forEach((item)=>{
        item.style.background = memoapp.colors.ztColor;
        item.style.color = memoapp.colors.btColor;
      });
      fas.forEach((item)=>item.style.color = memoapp.colors.btColor);
      notes.forEach((item)=>item.style.color = memoapp.colors.ftColor);
      textarea.style.color = this.colors.ftColor;
      ps.forEach((item,i)=>item.style.color = tparry[i]);
      this.notes.forEach((item)=>item.color = memoapp.colors.ftColor);
      this.save();console.log(this.colors)
    }
  }
  document.addEventListener('DOMContentLoaded',function(){memoapp.init()});
  window.memoapp = memoapp;
})()