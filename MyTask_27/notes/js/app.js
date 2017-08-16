// (function() {
//   let app = {

//     LOCAL_STORAGE_KEY: 'tom-notes',      // 请自行设置 LocalStrage 使用的 key 值

//     // 初始化
//     init() {
//       this.notes = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY)) || [];
//       this.selectedIndex = null;        // 当前选中的便签

//       this.$el = document.querySelector('#app');   // $ 开头的属性都是 DOM 元素，用于区分普通属性

//       // 对象作为事件监听器
//       // https://github.com/fe13/fe/blob/master/JavaScript/DOM/02.%20%E4%BA%8B%E4%BB%B6%E5%9F%BA%E7%A1%80.md#对象作为事件监听器
//       this.$el.addEventListener('click', this, false);

//       this.$main = this.$el.querySelector('.main-view');          // 主界面元素
//       this.$note = this.$el.querySelector('.note-view');          // 便签详情元素         
//       this.$notes = this.$el.querySelector('.notes');             // 便签列表容器
//       this.$trash = this.$note.querySelector('.nav-btn-trash');   // 垃圾桶按钮
//       this.$editor = this.$note.querySelector('.editor');         // textarea 元素

//       this.render();    // 渲染便签列表
//     },

//     // 当使用对象作为事件监听器时，该对象需要有 handleEvent 方法
//     handleEvent(event) {
//       let target = event.target;      // 根据触发事件的元素进行相应操作
//       switch (true) {
//         case target.matches('.fa.fa-bars'):
//           this.home();
//           break;
//         case target.matches('.fa.fa-gear'):
//           this.settings();
//           break;
//         case target.matches('.note'):
//           this.view(event);
//           break;
//         case target.matches('.add-note') || target.parentElement.matches('.add-note'):
//           this.add();
//           break;
//         case target.matches('.nav-btn-back'):
//           this.back(event);
//           break;
//         case target.matches('.nav-btn-trash'):
//           this.trash(event);
//           break;
//       }
//     },

//     // 切换到主页面
//     home() {
//       this.$main.classList.remove('flip');
//       this.$main.classList.add('home');
//     },

//     // 切换到设置页面
//     settings() {
//       this.$main.classList.remove('home');
//       this.$main.classList.add('flip');
//     },

//     // 新建便签
//     add() {
//       this.selectedIndex = null;
//       this.$note.classList.add('push');
//       this.$trash.style.visibility = 'hidden';    // 新建便签时隐藏删除按钮
//     },

//     // 查看便签详情
//     view(event) {
//       this.selectedIndex = event.target.dataset.index;
//       this.$editor.value = this.notes[this.selectedIndex].text;
//       this.$note.classList.add('push');
//       this.$trash.style.visibility = 'visible';    // 查看便签时显示删除按钮
//     },

//     // 点回退按钮时
//     back() {
//       // 当前正在新建便签
//       if (this.selectedIndex === null && this.$editor.value.length > 0) {
//         this.notes.push({ text: this.$editor.value });
//       }

//       // 当前正在查看便签
//       if (this.selectedIndex !== null) {
//         this.notes[this.selectedIndex].text = this.$editor.value;
//       }

//       this.save();
//       this.clear();
//       this.render();
//       this.pop();
//     },

//     // 隐藏详情页面
//     pop() {
//       this.$note.classList.remove('push');
//     },

//     // 保存数据到 LocalStorage
//     save() {
//       localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.notes));
//     },

//     // 清除编辑器内容
//     clear() {
//       this.$editor.value = '';
//     },

//     // 删除便签
//     trash() {
//       if (this.selectedIndex === null) return;
//       if (!confirm('确定要删除这个便签吗？')) return;
//       this.$editor.value = '';
//       this.notes.splice(this.selectedIndex, 1);
//       this.save();
//       this.render();
//       this.pop();
//     },

//     // 渲染列表
//     render() {
//       this.$notes.innerHTML = this.notes
//         .map(function(note, i) {
//           return `<div class='note' data-index='${i}'>${note.text}</div>`;
//         })
//         .join('');
//     }
//   };

//   //DOMContentLoaded 触发后再初始化 app
//   document.addEventListener('DOMContentLoaded', function() {
//     app.init();
//   });

//   window.app = app;
// })();


$(function(){
  let app={
    LOCAL_STORAGE_KEY: 'tom-notes',  // 请自行设置 LocalStrage 使用的 key 值

    // 初始化
    init(){
      this.notes = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY)) || [];
      this.selectedIndex = null;        // 当前选中的便签
      $('#app').on('click','.fa.fa-bars',function(){app.home()});
      $('#app').on('click','.fa.fa-gear',function(){app.settings()});
      $('#app').on('click','.note',function(){app.view(event)});
      $('#app').on('click','.add-note',function(){app.add()});
      $('#app').on('click','.nav-btn-back',function(){app.back()});
      $('#app').on('click','.nav-btn-trash',function(){app.trash()});
      this.render();
    },

    // 切换到主页面
    home(){
      $('.main-view').removeClass('flip');
      $('.main-view').addClass('home');
    },

    // 切换到设置页面
    settings(){
      $('.main-view').removeClass('home');
      $('.main-view').addClass('flip');
    },

    // 新建便签
    add(){
      this.selectedIndex = null;
      $('.note-view').addClass('push');
      $('.nav-btn-trash').css('visibility','hidden');   // 新建便签时隐藏删除按钮
    },

    // 查看便签详情
    view(e){
      this.selectedIndex = e.target.dataset.index;
      $('.editor').val(this.notes[this.selectedIndex].text);
      $('.note-view').addClass('push');
      $('.nav-btn-trash').css('visibility','visible');
    },

    // 点回退按钮时
    back(){
      // 当前正在新建便签
      if (this.selectedIndex === null && $('.editor').val().length > 0) {
        this.notes.push({text: $('.editor').val()});
      }
      // 当前正在查看便签
      if (this.selectedIndex !== null) {
        this.notes[this.selectedIndex].text = $('.editor').val();
      }
      this.save();
      this.clear();
      this.render();
      this.pop();
    },

    // 隐藏详情页面
    pop(){
      $('.note-view').removeClass('push');
    },

    // 保存数据到 LocalStorage
    save(){
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.notes));
    },

    // 清除编辑器内容
    clear(){
      $('.editor').val('');
    },

    // 删除便签
    trash(){
      if (this.selectedIndex === null) return;
      if (!confirm('确定要删除这个便签吗？')) return;
      $('.editor').val('');
      this.notes.splice(this.selectedIndex, 1);
      this.save();
      this.render();
      this.pop();
    },

    // 渲染列表
    render(){
      $('.notes').html(this.notes.map(function(note, i) {
          return `<div class='note' data-index='${i}'>${note.text}</div>`;
        }).join(''));
    }
  }

  app.init();

  window.app = app;
});

