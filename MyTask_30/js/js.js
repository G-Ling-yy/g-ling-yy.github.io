(function(){
  var myt = document.querySelector('#mytextarea');
  var myif = document.querySelector('iframe');

  myt.focus();

  myt.addEventListener('keydown',function(e){
    if (this.value.length === 0) return;
    if (e.ctrlKey && e.keyCode === 13) {
      var data = this.value.trim();
      myif.contentWindow.postMessage(data,'*');
      this.value = '';
    }
  })
})()