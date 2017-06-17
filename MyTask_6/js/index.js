window.onload = function(){
  var lis = document.querySelectorAll('#myrectnav ul li');
  lis[0].addEventListener('click',function(e){
    if (e.target.nodeName == 'SPAN') {
      document.querySelector('#myrectnav input').style.display = 'block';
      document.querySelector('#myrectnav button').style.display = 'block';
    }
  })
  document.querySelector('#myrectnav button').addEventListener('click',function(){
    this.parentNode.style.background = document.querySelector('#myrectnav input').value;
    document.querySelector('#myrectnav input').style.display = 'none';
    this.style.display = 'none';
  })
};