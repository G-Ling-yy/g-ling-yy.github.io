(function(){
  var backspace = document.querySelector('div.backspace');//获取退格元素
  var numbers = document.querySelectorAll('div.number');//获取数字元素列表
  var symbols = document.querySelectorAll('div.symbol');//获取操作符号元素列表
  var textresult = document.querySelector('input.result');//获取结果显示元素
  var hiddenspan = document.querySelector('span#hiddenspan');//获取用于放置结果以判断长度元素
  var anewcalculation = false;//定义一个判断是否新一次运算的布尔值
  var lastactstr = '';//定义一个可能存在的最后一次正确操作
  /*定义一个calculator结果对象*/
  var calculator = {
    /*定义result属性存储运算结果*/
    result: '',
    /*计算函数针对运算符号按钮的点击*/
    calculate(s){
      if (!this.result.length) {
        return this.result = '0'+s;
      }
      backspace.innerHTML = 'C';
      if (isSymbol(this.result[this.result.length-1])) {
        var temarr = this.result.split('');
        temarr.pop();
        temarr.push(s);
        return this.result = temarr.join('');
      }
      return this.result += s;
    }
  }
  /*遍历数字按钮并添加相应事件*/
  for (var n of numbers) {
    if (n.innerHTML === '.') {
      n.addEventListener('click',function(){
        if (anewcalculation) {
          calculator.result = this.innerHTML;
        } else if (calculator.result.indexOf('.') === -1) {
          calculator.result += '.';
        }
        showResult();
        anewcalculation = false;
        backspace.innerHTML = '←';
      })
    } else {
      n.addEventListener('click',function(){
        if (anewcalculation) {
          calculator.result = this.innerHTML;
        } else {
          calculator.result += this.innerHTML;
        }
        showResult();
        anewcalculation = false;
        backspace.innerHTML = '←';
      })
    }
  }
  /*遍历操作符号按钮并添加相应事件*/
  for (var s of symbols) {
    switch (s.innerHTML) 
    {
      case '+':
        s.addEventListener('click',function(){calculator.calculate('+');showResult();anewcalculation = false;});
        break;
      case '-':;
        s.addEventListener('click',function(){calculator.calculate('-');showResult();anewcalculation = false;});
        break;
      case '×':
        s.addEventListener('click',function(){calculator.calculate('×');showResult();anewcalculation = false;});
        break;
      case '÷':
        s.addEventListener('click',function(){calculator.calculate('÷');showResult();anewcalculation = false;});
        break;
      case '=':
        s.addEventListener('click',function(){
          if (!calculator.result.length) {
            calculator.result = '请先输入数字！'
          } else if (haveSymbol(calculator.result)) {
            if (isSymbol(calculator.result[calculator.result.length-1])) {
              calculator.result = replaceStrLast(calculator.result,'');
              calculator.result = calculator.result.replace(/×/g,'*').replace(/÷/g,'/');
              lastactstr = '';
              calculator.result = eval(calculator.result)+'';
            }else {
              calculator.result = calculator.result.replace(/×/g,'*').replace(/÷/g,'/');
              lastactstr = calculator.result.slice(findLastSymIndex(calculator.result));
              calculator.result = eval(calculator.result)+'';
            }
          } else {
            calculator.result = calculator.result.replace(/×/g,'*').replace(/÷/g,'/');
            calculator.result = eval(calculator.result+lastactstr)+'';
          }
          anewcalculation = true;
          backspace.innerHTML = 'C';
          showResult();
        })
    }
  }
  /*给退格按钮添加事件，有退格和清零两个功能*/
  backspace.addEventListener('click',function(){
    if (this.innerHTML === 'C') {
      calculator.result = '';
      lastactstr = '';
      textresult.focus();
    }else {
      calculator.result = replaceStrLast(calculator.result,'');
    }
    showResult();
  })
  /*判断字符是否是操作符号函数*/
  function isSymbol(v) {
    return v === '+' || v === '-' || v === '×' || v === '÷' || v === '*' || v === '/';
  }
  /*查找字符串中最后一个操作符号的下标函数*/
  function findLastSymIndex(s) {
    for (var i = s.length - 1; i >= 0; i--) {
      if (isSymbol(s[i])) {return i;}
    }
  }
  /*判断字符串是否含有操作符号函数*/
  function haveSymbol(s) {
    for (var i of s) {
      if (isSymbol(i)) {return true;}
    }
    return false;
  }
  /*替换字符串最后一个元素函数*/
  function replaceStrLast(s,t) {
    var temarr = s.split('');
    temarr.pop();
    temarr.push(t);
    return temarr.join('');
  }
  /*更新判断字符串长度是否缩放并输出结果*/
  function showResult(){
    hiddenspan.innerHTML = calculator.result;
    if (hiddenspan.offsetWidth > 288) {
      textresult.style.fontSize = 576/hiddenspan.offsetWidth + 'rem';
    }
    textresult.value = calculator.result;
  }
  document.querySelector('.btns .wrapper:first-child div').addEventListener('click',function(){
    var tf = confirm('是否确认强制清零并清除所有计算数据？');
    if (tf) {
      calculator.result = '';
      lastactstr = '';
      textresult.focus();
      showResult();
    }
  })
})()