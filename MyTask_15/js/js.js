(function(){
  function bigShowPic(){
    var pics = document.querySelectorAll('div > img');
    for (var i = pics.length - 1; i >= 0; i--) {
      (function(i){
        pics[i].addEventListener('click',function(){
          var tdiv = document.createElement('section');
          tdiv.classList.add('bg-gray');
          tdiv.innerHTML = '<img src="images/code-pic'+(Number(i)+1)+'.jpg">';
          tdiv.addEventListener('click',function(e){
            if (e.target.nodeName === 'SECTION') {
              document.body.removeChild(this);
            }
          })
          document.body.appendChild(tdiv);
        })
      })(i)
    }
  }
  function findOutEven(){
    var n = 10 + Math.ceil(Math.random() * 90);
    var even = [];
    for (var i = n; i >= 0; i--) {
      if (i % 2 === 0) {
        even.push(i);
      }
    }
    return even;
  }
  function findOutPrimeNum(){
    var n = 10 + Math.ceil(Math.random() * 90);
    var primenum = [];
    for (var i = n; i >= 2; i--) {
      var jug = true;
      var j = Math.floor(Math.sqrt(i));
      for (j; j >=2; j--) {
        if (i % j === 0) {
          jug=false;break;
        }
      }
      if (jug) {
        primenum.push(i);
      }
    }
    return primenum;
  }
  /**
   * 给定长方形的宽和高，计算其面积并返回。
   * 若 宽 === 高，则只需要传入宽的值。
   * @param {number} width 宽
   * @param {number} height 高
   * @return {number}
   */
  function area(width, height=width) {
    if (arguments.length === 0) {
      return Math.floor(Math.pow((Math.random()*90+10),2));
    }
    return width * height;
  }
  /**
   * 输入任意数目的数字参数，返回其中最大的数字。
   * @return {number}
   */
  function max() {
    var maxnum = arguments[0];
    for (var i = arguments.length - 1; i >= 0; i--) {
      if (arguments[i] > maxnum) {
        maxnum = arguments[i];
      }
    }
    return maxnum;
  }
  /**
   * 给定数字 x，返回 x 自乘 n 次的结果。
   * @param {number} x
   * @param {number} n - 正整数
   * @return {number}
   */
  function pow(x, n) {
    var result = 1;
    if (n < 0) {
      for (var i = Math.abs(n); i >= 1; i--) {
        result *= x;
      }
      return 1/result;
    }
    else if (n === 0) {
      return result;
    }else {
      for (var i = n; i >= 1; i--) {
        result *= x;
      }
      return result;
      }
  }
  /**
   * 计算在某段文本 content 中出现某个特定字符串 search 的次数。
   * @param {string} content - 被搜索的文本内容
   * @param {string} search - 查找的字符串
   * @return {number} 字符串 search 在 content 中出现的次数，没有则返回 0。
   */
  function appearances(content, search) {
    var value = new RegExp(search,'gi');
    if (content.match(value) === null) {
      return 0;
    }
    return content.match(value).length;
  }
  function actAllFunctions(){
    bigShowPic();
    document.write(findOutEven()+'<br><br>');
    document.write(findOutPrimeNum()+'<br><br>');
    document.write('宽12高10的长方形面积为：'+area(12,10)+'<br><br>');
    document.write('宽12的长方形面积为：'+area(12)+'<br><br>');
    document.write('未设宽高的长方形面积为：'+area()+'<br><br>');
    document.write('随机数字17,19,80,81,33,27中最大值为：'+max(17,19,80,81,33,27)+'<br><br>');
    document.write('3的-4次方是：'+pow(3,-4)+'<br><br>');
    document.write('平平仄仄平平仄，仄仄平平仄仄平 中有仄的个数：'+appearances('平平仄仄平平仄，仄仄平平仄仄平','仄')+'<br><br>');
  }
  actAllFunctions();
})()