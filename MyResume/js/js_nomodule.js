var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Gradient = function () {
  function Gradient(el, pp, time) {
    _classCallCheck(this, Gradient);

    this.$el = el;
    this.pp = pp;
    this.time = time;
    this.$el.style.transition = this.time / 700 + 's';
  }

  _createClass(Gradient, [{
    key: 'start',
    value: function start() {
      var _this = this;

      var eldom = this.$el;
      setInterval(function () {
        return change(_this.pp);
      }, this.time);
      function change(p) {
        var ary = [];
        for (var i = 0; i < 3; i++) {
          ary.push(Math.ceil(Math.random() * 255));
        }
        ary.push(Math.ceil(Math.random() * 5 + 5) / 10);
        p === 1 ? eldom.style.backgroundColor = 'rgba(' + ary[0] + ', ' + ary[1] + ', ' + ary[2] + ', ' + ary[3] + ')' : eldom.style.color = 'rgba(' + ary[0] + ', ' + ary[1] + ', ' + ary[2] + ', ' + ary[3] + ')';
      }
    }
  }]);

  return Gradient;
}();

var Cube = function () {
  function Cube(el, swidth) {
    _classCallCheck(this, Cube);

    this.$el = el;
    this.swidth = swidth;
    this.$faces = [];
  }

  _createClass(Cube, [{
    key: 'createDoms',
    value: function createDoms() {
      this.$container = document.createElement('div');
      this.$container.className = 'cube_container';
      this.$el.appendChild(this.$container);
      for (var i = 0; i < 6; i++) {
        var newface = document.createElement('div');
        newface.className = 'cube_face';
        this.$container.appendChild(newface);
        this.$faces.push(newface);
      }
    }
  }, {
    key: 'colorCube',
    value: function colorCube() {
      if (!arguments.length) return;
      var args = Array.from(arguments);
      if (args.length > 5) args = args.slice(0, 5);
      this.$faces.forEach(function (ele, i) {
        ele.style.backgroundColor = args[i];
      });
      var lastface = new Gradient(this.$faces[5], 1, 2700);
      lastface.start();
    }
  }]);

  return Cube;
}();

var Build_3D = function () {
  function Build_3D(el) {
    var _this2 = this;

    _classCallCheck(this, Build_3D);

    this.$el = el;
    this.secs = this.$el.querySelectorAll('section');
    switch (location.hash.slice(1)) {
      case 'hp_sec':
        this.$el.style.transform = 'rotateY(120deg)';
        this.recording('hp_sec', 120);
        if (!document.querySelector('#cube .cube_container')) {
          var cube = new Cube(document.querySelector('#cube'));
          cube.createDoms();
          cube.colorCube('#f00', '#0f0', '#00f', '#fff', '#000');
        }
        break;
      case 'pd_sec':
        this.$el.style.transform = 'rotateY(-120deg)';
        this.recording('pd_sec', -120);
        break;
      case 'pi_sec':
        this.$el.style.transform = 'rotateY(0)';
        this.recording('pi_sec', 0);
        break;
      default:
        if (localStorage.getItem('usinghash')) {
          this.$el.style.transform = 'rotateY(' + JSON.parse(localStorage.getItem('usinghash')).angle + 'deg)';
          location.hash = JSON.parse(localStorage.getItem('usinghash')).hash;
        } else {
          this.$el.style.transform = 'rotateY(0)';
          location.hash = 'pi_sec';
          this.recording('pi_sec', 0);
        }
    }
    onresize = function onresize() {
      return _this2.build();
    };
  }

  _createClass(Build_3D, [{
    key: 'build',
    value: function build() {
      var w = innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      var num = w * .01444;
      this.secs[0].style.transform = 'translateX(-100%) rotateY(-120deg)';
      this.secs[1].style.transform = 'translateX(100%) rotateY(120deg)';
      this.$el.style.transformOrigin = '50% 50% -' + num + 'rem';
    }
  }, {
    key: 'change',
    value: function change() {
      var _this3 = this;

      window.addEventListener('hashchange', function () {
        if (!localStorage.getItem('usinghash')) location.reload();
        var obj = JSON.parse(localStorage.getItem('usinghash'));
        var newhash = location.hash.slice(1);
        if (obj.hash === newhash) return;
        switch (newhash) {
          case 'hp_sec':
            if (!document.querySelector('#cube .cube_container')) {
              var cube = new Cube(document.querySelector('#cube'));
              cube.createDoms();
              cube.colorCube('#f00', '#0f0', '#00f', '#fff', '#000');
            }
            obj.hash === 'pd_sec' ? _this3.$el.style.transform = 'rotateY(' + (obj.angle - 120) + 'deg)' : _this3.$el.style.transform = 'rotateY(' + (obj.angle + 120) + 'deg)';
            obj.hash === 'pd_sec' ? obj.angle -= 120 : obj.angle += 120;
            _this3.recording(newhash, obj.angle);
            break;
          case 'pd_sec':
            obj.hash === 'pi_sec' ? _this3.$el.style.transform = 'rotateY(' + (obj.angle - 120) + 'deg)' : _this3.$el.style.transform = 'rotateY(' + (obj.angle + 120) + 'deg)';
            obj.hash === 'pi_sec' ? obj.angle = obj.angle - 120 : obj.angle = obj.angle + 120;
            _this3.recording(newhash, obj.angle);
            break;
          case 'pi_sec':
            obj.hash === 'hp_sec' ? _this3.$el.style.transform = 'rotateY(' + (obj.angle - 120) + 'deg)' : _this3.$el.style.transform = 'rotateY(' + (obj.angle + 120) + 'deg)';
            obj.hash === 'hp_sec' ? obj.angle = obj.angle - 120 : obj.angle = obj.angle + 120;
            _this3.recording(newhash, obj.angle);
            break;
          default:
            return location.hash = obj.hash;
        }
      });
    }
  }, {
    key: 'recording',
    value: function recording(str, agl) {
      localStorage.setItem('usinghash', JSON.stringify({ hash: str, angle: agl }));
    }
  }]);

  return Build_3D;
}();

var MyInfo = function () {
  function MyInfo(el, obj) {
    _classCallCheck(this, MyInfo);

    this.$el = el;
    this.obj = obj;
  }

  _createClass(MyInfo, [{
    key: 'showme',
    value: function showme() {
      var txt = '<h1>\u4E2A\u4EBA\u7B80\u4ECB\uFF1A</h1>\n      <p>\u59D3\u540D\uFF1A<span>' + this.obj.name + '</span></p>\n      <p>\u5E74\u9F84\uFF1A<span>' + this.obj.age + '</span></p>\n      <p>\u6027\u522B\uFF1A<span>' + this.obj.sex + '</span></p>\n      <p>2016\u5E747\u6708\u6BD5\u4E1A\u4E8E <span>' + this.obj.school + '</span></p>\n      <p>\u6240\u4E60\u4E13\u4E1A\uFF1A<span>' + this.obj.major + '</span></p>\n      <p>QQ\uFF1A<a href="tencent://message/?uin=' + this.obj.QQ + '">' + this.obj.QQ + '</a></p>\n      <p>TEL\uFF1A<a href="tel:18860913014">' + this.obj.tel + '</a></p>\n      <p>\u81EA\u6211\u8BC4\u4EF7: <a id="rsrx">' + this.obj.pj + '</a></p>';
      this.$el.innerHTML = txt;
    }
  }]);

  return MyInfo;
}();

var Myobj = {
  init_pi: function init_pi() {
    //我的信息对象
    var me_obj = { name: '高大全', sex: '男', age: 24, school: '苏州市职业大学', major: '软件技术', aim: '前端实习工作', QQ: 934830721, tel: 18860913014, pj: '本人性格开朗、稳重、有活力、待人热情、真诚。有较强的团队协作精神，较好的社交能力，善于处理各种人际关系。能尽快适应各种环境并融入其中。能把企业财富当作自身财富，在努力为企业服务的过程中实现自身价值。'
      //信息对象渲染指定DOM
    };var info = new MyInfo(document.querySelector('#myinfo'), me_obj);
    info.showme();
    //为指定aDOM添加事件
    var a_hp = document.querySelector('#rsrx');
    var a_pd = document.querySelector('#more');
    aevent();
    //实例化一个3D对象，使全局变成三棱柱形状
    var build_3d = new Build_3D(document.querySelector('main'));
    build_3d.build();
    build_3d.change();
    function aevent() {
      a_hp.addEventListener('click', function () {
        return location.hash = 'hp_sec';
      });
      a_pd.addEventListener('click', function () {
        return location.hash = 'pd_sec';
      });
    }
  },
  init_hp: function init_hp() {
    var txt = '<p>\u70BD\u7130\u5982\u706B\u4F3C\u4F60\u7684\u70ED\u60C5\u4E00\u9F13\u4F5C\u6C14</p><p>\u76C8\u76C8\u5982\u539F\u50CF\u4F60\u7684\u5F85\u4EBA\u4EB2\u548C\u5982\u6625</p><p>\u575A\u6BC5\u5982\u521A\u662F\u4F60\u7684\u539F\u5219\u4E0D\u53EF\u52A8\u6447</p><p>\u4EBA\u751F\u5982\u6C34\u968F\u6CE2\u9010\u6D41</p><p>\u6D41\u8FC7\u8FD9\u91CC\u9014\u5F84\u90A3\u91CC</p><p>\u78E8\u5E73\u4E86\u68F1\u89D2\u6D17\u6DA4\u4E86\u7075\u9B42</p><p>\u9ED1\u591C\u822C\u65E0\u8FB9\u65E0\u9645\u662F\u4F60\u7684\u6781\u9650</p><p>\u767D\u663C\u6837\u5149\u8292\u4E07\u4E08\u662F\u4F60\u7684\u53E6\u4E00\u4E2A\u6781\u9650</p><p>\u4EBA\u751F\u4E94\u5F69\u4EBA\u751F\u767E\u5473</p><p>\u600E\u4EC5\u4E94\u5F69\u5C82\u6B62\u767E\u5473</p><p>\u8F6C\u554A\u8F6C\u554A\u770B\u554A\u770B\u554A</p><p>\u60F3\u554A\u60F3\u554A\u76FC\u554A\u76FC\u554A</p><p>\u4EC0\u4E48\u90FD\u6CA1\u6709</p><p>\u771F\u7684\u4EC0\u4E48\u90FD\u6CA1\u6709</p><p>\u7ADF\u771F\u662F\u4EC0\u4E48\u90FD\u6CA1\u6709</p><p>\u5475</p><p>\u4EBA\u751F\u5982\u620F</p><p>\u5F88\u770B\u8FD0\u6C14</p><p>\u613F\u4F60\u6211\u597D\u8FD0</p><p>GoodLuck~</p>';
    document.querySelector('#goodluck').innerHTML = txt;
    var $ps = document.querySelectorAll('#luck p');
    //为指定P元素添加事件函数执行
    psevent();
    //通过实例化对象使得hp_sec页面文字颜色渐变
    var words = new Gradient(document.querySelector('#goodluck'), 2, 7000);
    words.start();
    function psevent() {
      $ps[0].addEventListener('click', function () {
        location.hash = 'pd_sec';
      });
      $ps[1].addEventListener('click', function () {
        location.hash = 'pi_sec';
      });
    }
  },
  init_pd: function init_pd() {
    var $demos = document.querySelector('#demos');
    var demos_array = [{ name: 'QQmusic(\u4EFF)', function: '\u63A8\u8350, \u8F6E\u64AD, \u6392\u884C\u699C, \u6B4C\u66F2\u641C\u7D22, \u6B4C\u66F2\u64AD\u653E, \u6B4C\u8BCD\u540C\u6B65', skill: 'sass, setTimeout(), setInterval(), .map(), .bind(), lazyload()\u61D2\u52A0\u8F7D, throttle\u8282\u6D41, fetch(), switch\xB7\xB7\xB7case, localStorage, matches, audio, RegExp', url: 'https://g-ling-yy.github.io/QQmusic/', codeurl: 'https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/QQmusic' }, { name: 'Github User Finder', function: '\u6839\u636E\u540D\u5B57\u67E5\u627EGithub\u7528\u6237\u57FA\u672C\u4FE1\u606F', skill: 'debounce, await async promise, ', url: 'https://g-ling-yy.github.io/MyTask_29/', codeurl: 'https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_29' }, { name: 'Ajax', function: '\u901A\u8FC7ajax\u5BF9\u6570\u636E\u8FDB\u884C\u589E\u5220\u6539\u9664\u7B49\u64CD\u4F5C', skill: 'ajax get, ajax post, ajax put, ajax delete', url: 'https://g-ling-yy.github.io/MyTask_25/', codeurl: 'https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_25' }, { name: 'note', function: '\u7B80\u6613\u4FBF\u7B7E\uFF0C\u8BB0\u5F55\u6570\u636E\u5E76\u4FDD\u5B58\u5728\u672C\u5730localStorage, \u66F4\u6539\u5916\u89C2\u4E3B\u9898', skill: 'sass, handleEvent, localStorage, switch\xB7\xB7\xB7case, @media', url: 'https://g-ling-yy.github.io/MyTask_22/', codeurl: 'https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_22' }, { name: 'calculator', function: '\u7B80\u6613\u529F\u80FD\u7684\u8BA1\u7B97\u5668', skill: 'flex, sass, for\xB7\xB7\xB7of, eval()', url: 'https://g-ling-yy.github.io/MyTask_19/', codeurl: 'https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_19' }, { name: 'array', function: '\u5C55\u793A\u6570\u7EC4\u57FA\u672C\u65B9\u6CD5', skill: 'animation, classList, Dom node, Math, push(), reduce(), split(), filter(), find()', url: 'https://g-ling-yy.github.io/MyTask_15/', codeurl: 'https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_15' }, { name: 'string', function: '\u5C55\u793A\u5B57\u7B26\u4E32\u57FA\u672C\u65B9\u6CD5', skill: 'transition, Date(), replace(), repeat(), indexOf(), match()', url: 'https://g-ling-yy.github.io/MyTask_14/', codeurl: 'https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_14' }, { name: 'sass', function: '\u8DD1\u9A6C\u706F\u56FE\u7247\u5C55\u793A', skill: 'sass, perspective, preserve-3d, animation', url: 'https://g-ling-yy.github.io/MyTask_12/', codeurl: 'https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_12' }, { name: '3D', function: '\u4E00\u4E9B3D\u5C0F\u6548\u679C', skill: 'perspective, preserve-3d, flex, transform', url: 'https://g-ling-yy.github.io/MyTask_8/', codeurl: 'https://github.com/G-Ling-yy/g-ling-yy.github.io/tree/master/MyTask_8' }];
    //渲染项目内容
    render($demos, demos_array);
    function render(dom, arr) {
      arr.forEach(function (ele) {
        dom.innerHTML += '<div class="demo">\n          <h1>' + ele.name + '</h1>\n          <p>\u529F\u80FD\u6982\u8981\uFF1A<span>' + ele.function + '</span></p>\n          <p>\u6280\u672F\u8981\u70B9\uFF1A<span>' + ele.skill + '</span></p>\n          <p>\u5B9E\u4F8B\u94FE\u63A5\uFF1A<a href="' + ele.url + '" target="_blank.">' + ele.url + '</a></p>\n          <p>Github\u6E90\u7801\uFF1A<a href="' + ele.codeurl + '" target="_blank"></a></p>\n        </div>';
      });
    }
    //为指定P元素添加点击事件
    document.querySelector('section.pd_sec').addEventListener('click', function (e) {
      var target = e.target;
      if (target.matches('.demo p span')) {
        var eleP = target.parentNode;
        if (!eleP.style.overflow || eleP.style.overflow === 'hidden') {
          eleP.style.overflow = 'initial';
          eleP.style.whiteSpace = 'normal';
        } else {
          eleP.style.overflow = 'hidden';
          eleP.style.whiteSpace = 'nowrap';
        }
      } else if (target.matches('a.toleft') || target.matches('a.toright')) {
        target.matches('a.toleft') ? location.hash = 'pi_sec' : location.hash = 'hp_sec';
      }
    });
  },
  init: function init() {
    this.init_pi();
    this.init_hp();
    this.init_pd();
  }
};
function IEVersion() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if(isIE11) {
    document.querySelector('main').style.display = 'none'
    document.querySelector('div#container_print').style.display = 'flex' 
  }else {
    Myobj.init();
  }
}
IEVersion()