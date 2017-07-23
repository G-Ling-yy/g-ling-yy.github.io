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
          closeBigPic();
        })
      })(i)
    }
  }
  function closeBigPic(){
    var tlast = document.body.lastElementChild;
    if (tlast.nodeName === 'SECTION' && tlast.getAttribute('class') === 'bg-gray' ) {
      document.addEventListener('keydown',function(event){
        if (event.keyCode === 27) {
          document.body.removeChild(tlast);
        }
      })
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
  /**
   * 给一定个数字数组，计算该数组元素的和。
   * 输入 [1, 2, 3] 返回 6。
   * @param {number[]} numbers
   * @return {number}
   */
  function sumOfArray(numbers) {
    return numbers.reduce(function(pv,cv,i){return pv + cv;});
  }
  /**
   * 给定一个字符串，将这个字符串反转并返回。
   * 输入 'ABCDE' 返回 'EDCBA'。
   * @param {string} s
   * @return {string}
   */
  function reverseOfString(s) {
    return s.split('').reverse().join('');
  }
  /**
   * 给定一个公元年份(1 - 10000)，返回相应中国农历年的 emoji 图案。
   * 输入 2018 返回 "🐶"。已知公元 2017 年是中国农历鸡年。
   * @param {number} year 
   * @param {string}
   */
  function sx(year) {
    var rooster = "鸡";  /*emoji在我这无法正常显示，我就更换为了汉字*/
    var sxs = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
    var i = year % 12;
    if (year < 1 || year > 10000) {
      return '请输入1-10000之间的正确年份~';
    }
    return sxs[(i+8)%12];
  }
  /**
   * 给定一个数字数组，移除其中的重复元素后返回。
   * 输入 [1, 1, 3, 4, 3, 6] 返回 [1, 3, 4, 6]。
   * @param {number[]} numbers
   * @return {number[]}
   */
  function unique(numbers) {
    return numbers.reduce(function(pv,cv,i){
      if (pv.indexOf(cv) === -1) {
        pv.push(cv);
      }
      return pv;
    },[]);
  }
  /** 
   * 给定一个非负整数，它的各位数字以数组存储，给这个数字加 1。
   * 除了数字 0 以外，该数字不会以 0 开头。数字最高位在数组开头。
   * 输入 [1, 2, 3] 以表示数字 123，返回 [1, 2, 4]
   * 输入 [9, 9, 9] 以表示数字 999，返回 [1, 0, 0, 0]
   * @param {number[]} digits 用于表示输入数字各个位数的数组
   * @return {number[]} 用于表示结果数字各个位数的新数组
   */
  function plusOne(digits) {
    if (digits[0] === 0) {
      return '虽然是数组但好赖是表示数字好吧，不能以0开头。';
    }
    return ((Number(digits.join('')) + 1) + '').split('').map(Number);
  }
  /**
   * 给定一个只包含 '(', ')', '{', '}', '[', ']' 的字符串，判断字符串内的括号是否匹配。
   * '()' 及 '()[]{}' 表示匹配，而 '(]' 和 '([)]' 是不匹配的。匹配返回 true，否则 false。
   * @param {string} s
   * @return {boolean}
   */
  function valid(s) {
    var reg1 = /[^\(\)\{\}\[\]]/g;
    if (s === '' || typeof s != 'string' || s.match(reg1)) {
      return '请输入只包含(){}[]的字符串。';
    }
    return s.split('').every(function(item,i,arr){
      if (i % 2 === 0) {
        if ((item === '(' && arr[i+1] !== ')') || (item === '[' && arr[i+1] !== ']') || (item === '{' && arr[i+1] !== '}')) {
          return false;
        }else {
          return true;
        }
      }else {
          return true;
        }
    });
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
    document.write('[1,9,9,4,3,7]的元素之和为：'+sumOfArray([1,9,9,4,3,7])+'<br><br>');
    document.write('"所爱隔山海，山海不可平"的反转字符串是：'+reverseOfString("所爱隔山海，山海不可平")+'<br><br>');
    document.write('公元2020年是中国农历的'+sx(2020)+'年<br><br>');
    document.write('随机数组[1, 3, 7, 2, 5, 2, 5, 3]的去重复后新数组为：'+unique([1, 3, 7, 2, 5, 2, 5, 3])+'<br><br>');
    document.write('[9, 9, 9]的plusOne函数结果是：'+plusOne([9, 9, 9])+'<br><br>');
    document.write('()[]{}的匹配结果是：'+valid('()[]{}')+'<br><br>');
    document.write('([)]的匹配结果是：'+valid('([)]')+'<br><br>');
  }
  actAllFunctions();
})()