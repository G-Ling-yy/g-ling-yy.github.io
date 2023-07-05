/**
 * 公共工具js
 *
 * this.Utils.browser
 */
export default {
  //获取当前浏览器信息
  browser: {
    version: (function() {
      let u = navigator.userAgent.toLowerCase();
      return {
        ie: u.indexOf("trident") > -1,
        opera: u.indexOf("tresto") > -1,
        webKit: u.indexOf("applewebkit") > -1,
        firefox: u.indexOf("gecko") > -1 && u.indexOf("khtml") == -1,
        mobile: !!u.match(/applewebkit.*mobile.*/),
        ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/),
        android: u.indexOf("android") > -1 || u.indexOf("linux") > -1,
        iphone: u.indexOf("iphone") > -1,
        ipad: u.indexOf("ipad") > -1,
        weixin: u.match(/micromessenger/i) == "micromessenger"
      };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  },
  /**
   * @desc 函数防抖
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param immediate true 表立即执行，false 表非立即执行
   */
  debounce(func, wait, immediate) {
    let timeout;

    console.info("debounce", func, wait, immediate);
    return function() {
      let context = this;
      let args = arguments;

      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(() => {
          timeout = null;
        }, wait);
        if (callNow) func.apply(context, args);
      } else {
        timeout = setTimeout(function() {
          func.apply(context, args);
        }, wait);
      }
    };
  },
  /**
   * @desc 函数节流
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param type 1 表时间戳版，2 表定时器版
   */
  throttle(func, wait, type) {
    if (type === 1) {
      var previous = 0;
    } else if (type === 2) {
      var timeout;
    }
    return function() {
      let context = this;
      let args = arguments;
      if (type === 1) {
        let now = Date.now();

        if (now - previous > wait) {
          func.apply(context, args);
          previous = now;
        }
      } else if (type === 2) {
        if (!timeout) {
          timeout = setTimeout(() => {
            timeout = null;
            func.apply(context, args);
          }, wait);
        }
      }
    };
  },
  /**
   * 产生任意长度随机字母数字组合
   *
   * @param randomFlag 是否任意长度
   * @param min 任意长度最小位[固定位数]
   * @param max 任意长度最大位
   * @returns {string}
   */
  randomString: function(randomFlag, min, max, rightStr) {
    var str = "",
      range = min,
      arr = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ];

    // 随机产生
    if (randomFlag) {
      min = min ? min : 6;
      max = max ? max : 20;
      range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
      if (rightStr) {
        str += rightStr;
        continue;
      }
      var pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  },
  checkObjectClass: {
    hasClass: function(cName, obj) {
      return !!obj.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
    },
    addClass: function(cName, obj) {
      if (!this.hasClass(cName, obj)) {
        obj.className += " " + cName;
      }
    },
    removeClass: function(cName, obj) {
      if (this.hasClass(cName, obj)) {
        obj.className = obj.className.replace(
          new RegExp("(\\s|^)" + cName + "(\\s|$)"),
          " "
        );
      }
    }
  },
  /*获取路径中文件名，带后缀*/
  //getPathFileName:function(path){return path.substring(path.lastIndexOf("\/")+1);},
  /*时间函数*/
  date: function(format, timestamp) {
    var jsdate, f;
    var txt_words = [
      "Sun",
      "Mon",
      "Tues",
      "Wednes",
      "Thurs",
      "Fri",
      "Satur",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var formatChr = /\\?(.?)/gi;
    var formatChrCb = function(t, s) {
      return f[t] ? f[t]() : s;
    };
    var _pad = function(n, c) {
      n = String(n);
      while (n.length < c) {
        n = "0" + n;
      }
      return n;
    };
    f = {
      d: function() {
        return _pad(f.j(), 2);
      },
      D: function() {
        return f.l().slice(0, 3);
      },
      j: function() {
        return jsdate.getDate();
      },
      l: function() {
        return txt_words[f.w()] + "day";
      },
      N: function() {
        return f.w() || 7;
      },
      S: function() {
        var j = f.j();
        var i = j % 10;
        if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
          i = 0;
        }
        return ["st", "nd", "rd"][i - 1] || "th";
      },
      w: function() {
        return jsdate.getDay();
      },
      z: function() {
        var a = new Date(f.Y(), f.n() - 1, f.j());
        var b = new Date(f.Y(), 0, 1);
        return Math.round((a - b) / 86400000);
      },
      W: function() {
        var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
        var b = new Date(a.getFullYear(), 0, 4);
        return _pad(1 + Math.round((a - b) / 86400000 / 7), 2);
      },
      F: function() {
        return txt_words[6 + f.n()];
      },
      m: function() {
        return _pad(f.n(), 2);
      },
      M: function() {
        return f.F().slice(0, 3);
      },
      n: function() {
        return jsdate.getMonth() + 1;
      },
      t: function() {
        return new Date(f.Y(), f.n(), 0).getDate();
      },
      L: function() {
        var j = f.Y();
        return ((j % 4 === 0) & (j % 100 !== 0)) | (j % 400 === 0);
      },
      o: function() {
        var n = f.n();
        var W = f.W();
        var Y = f.Y();
        return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
      },
      Y: function() {
        return jsdate.getFullYear();
      },
      y: function() {
        return f
          .Y()
          .toString()
          .slice(-2);
      },
      a: function() {
        return jsdate.getHours() > 11 ? "pm" : "am";
      },
      A: function() {
        return f.a().toUpperCase();
      },
      B: function() {
        var H = jsdate.getUTCHours() * 3600;
        var i = jsdate.getUTCMinutes() * 60;
        var s = jsdate.getUTCSeconds();
        return _pad(Math.floor((H + i + s + 3600) / 86.4) % 1000, 3);
      },
      g: function() {
        return f.G() % 12 || 12;
      },
      G: function() {
        return jsdate.getHours();
      },
      h: function() {
        return _pad(f.g(), 2);
      },
      H: function() {
        return _pad(f.G(), 2);
      },
      i: function() {
        return _pad(jsdate.getMinutes(), 2);
      },
      s: function() {
        return _pad(jsdate.getSeconds(), 2);
      },
      u: function() {
        return _pad(jsdate.getMilliseconds() * 1000, 6);
      },
      e: function() {
        throw "Not supported (see source code of date() for timezone on how to add support)";
      },
      I: function() {
        var a = new Date(f.Y(), 0);
        var c = Date.UTC(f.Y(), 0);
        var b = new Date(f.Y(), 6);
        var d = Date.UTC(f.Y(), 6);
        return a - c !== b - d ? 1 : 0;
      },
      O: function() {
        var tzo = jsdate.getTimezoneOffset();
        var a = Math.abs(tzo);
        return (
          (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + (a % 60), 4)
        );
      },
      P: function() {
        var O = f.O();
        return O.substr(0, 3) + ":" + O.substr(3, 2);
      },
      T: function() {
        return "UTC";
      },
      Z: function() {
        return -jsdate.getTimezoneOffset() * 60;
      },
      c: function() {
        return "Y-m-d\\TH:i:sP".replace(formatChr, formatChrCb);
      },
      r: function() {
        return "D, d M Y H:i:s O".replace(formatChr, formatChrCb);
      },
      U: function() {
        return (jsdate / 1000) | 0;
      }
    };
    this.date = function(format, timestamp) {
      //that = this;
      jsdate =
        timestamp === undefined
          ? new Date()
          : timestamp instanceof Date
          ? new Date(timestamp)
          : new Date(timestamp * 1000);
      return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
  },
  time: function() {
    return Math.floor(new Date().getTime() / 1000);
  },
  microtime: function(get_as_float) {
    if (typeof performance !== "undefined" && performance.now) {
      let now = (performance.now() + performance.timing.navigationStart) / 1000;
      if (get_as_float) {
        return now;
      }
      let s = now | 0;
      return Math.round((now - s) * 1000000) / 1000000 + " " + s;
    } else {
      let now = (Date.now ? Date.now() : new Date().getTime()) / 1000;
      if (get_as_float) {
        return now;
      }
      let s = now | 0;
      return Math.round((now - s) * 1000) / 1000 + " " + s;
    }
  },
  strtotime: function(text, now) {
    var parsed,
      match,
      today,
      year,
      date,
      days,
      ranges,
      len,
      times,
      regex,
      i,
      fail = false;
    if (!text) {
      return fail;
    }
    text = text
      .replace(/^\s+|\s+$/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/[\t\r\n]/g, "")
      .toLowerCase();
    match = text.match(
      /^(\d{1,4})([-./:])(\d{1,2})([-./:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/
    );
    if (match && match[2] === match[4]) {
      if (match[1] > 1901) {
        switch (match[2]) {
          case "-":
            if (match[3] > 12 || match[5] > 31) {
              return fail;
            }
            return (
              new Date(
                match[1],
                parseInt(match[3], 10) - 1,
                match[5],
                match[6] || 0,
                match[7] || 0,
                match[8] || 0,
                match[9] || 0
              ) / 1000
            );
          case ".":
            return fail;
          case "/":
            if (match[3] > 12 || match[5] > 31) {
              return fail;
            }
            return (
              new Date(
                match[1],
                parseInt(match[3], 10) - 1,
                match[5],
                match[6] || 0,
                match[7] || 0,
                match[8] || 0,
                match[9] || 0
              ) / 1000
            );
        }
      } else {
        if (match[5] > 1901) {
          switch (match[2]) {
            case "-":
              if (match[3] > 12 || match[1] > 31) {
                return fail;
              }
              return (
                new Date(
                  match[5],
                  parseInt(match[3], 10) - 1,
                  match[1],
                  match[6] || 0,
                  match[7] || 0,
                  match[8] || 0,
                  match[9] || 0
                ) / 1000
              );
            case ".":
              if (match[3] > 12 || match[1] > 31) {
                return fail;
              }
              return (
                new Date(
                  match[5],
                  parseInt(match[3], 10) - 1,
                  match[1],
                  match[6] || 0,
                  match[7] || 0,
                  match[8] || 0,
                  match[9] || 0
                ) / 1000
              );
            case "/":
              if (match[1] > 12 || match[3] > 31) {
                return fail;
              }
              return (
                new Date(
                  match[5],
                  parseInt(match[1], 10) - 1,
                  match[3],
                  match[6] || 0,
                  match[7] || 0,
                  match[8] || 0,
                  match[9] || 0
                ) / 1000
              );
          }
        } else {
          switch (match[2]) {
            case "-":
              if (
                match[3] > 12 ||
                match[5] > 31 ||
                (match[1] < 70 && match[1] > 38)
              ) {
                return fail;
              }
              year =
                match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
              return (
                new Date(
                  year,
                  parseInt(match[3], 10) - 1,
                  match[5],
                  match[6] || 0,
                  match[7] || 0,
                  match[8] || 0,
                  match[9] || 0
                ) / 1000
              );
            case ".":
              if (match[5] >= 70) {
                if (match[3] > 12 || match[1] > 31) {
                  return fail;
                }
                return (
                  new Date(
                    match[5],
                    parseInt(match[3], 10) - 1,
                    match[1],
                    match[6] || 0,
                    match[7] || 0,
                    match[8] || 0,
                    match[9] || 0
                  ) / 1000
                );
              }
              if (match[5] < 60 && !match[6]) {
                if (match[1] > 23 || match[3] > 59) {
                  return fail;
                }
                today = new Date();
                return (
                  new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                    match[1] || 0,
                    match[3] || 0,
                    match[5] || 0,
                    match[9] || 0
                  ) / 1000
                );
              }
              return fail;
            case "/":
              if (
                match[1] > 12 ||
                match[3] > 31 ||
                (match[5] < 70 && match[5] > 38)
              ) {
                return fail;
              }
              year =
                match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
              return (
                new Date(
                  year,
                  parseInt(match[1], 10) - 1,
                  match[3],
                  match[6] || 0,
                  match[7] || 0,
                  match[8] || 0,
                  match[9] || 0
                ) / 1000
              );
            case ":":
              if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                return fail;
              }
              today = new Date();
              return (
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  match[1] || 0,
                  match[3] || 0,
                  match[5] || 0
                ) / 1000
              );
          }
        }
      }
    }
    if (text === "now") {
      return now === null || isNaN(now)
        ? (new Date().getTime() / 1000) | 0
        : now | 0;
    }
    if (!isNaN((parsed = Date.parse(text)))) {
      return (parsed / 1000) | 0;
    }
    date = now ? new Date(now * 1000) : new Date();
    days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    ranges = {
      yea: "FullYear",
      mon: "Month",
      day: "Date",
      hou: "Hours",
      min: "Minutes",
      sec: "Seconds"
    };
    function lastNext(type, range, modifier) {
      var diff,
        day = days[range];
      if (typeof day !== "undefined") {
        diff = day - date.getDay();
        if (diff === 0) {
          diff = 7 * modifier;
        } else {
          if (diff > 0 && type === "last") {
            diff -= 7;
          } else {
            if (diff < 0 && type === "next") {
              diff += 7;
            }
          }
        }
        date.setDate(date.getDate() + diff);
      }
    }
    function process(val) {
      var splt = val.split(" "),
        type = splt[0],
        range = splt[1].substring(0, 3),
        typeIsNumber = /\d+/.test(type),
        ago = splt[2] === "ago",
        num = (type === "last" ? -1 : 1) * (ago ? -1 : 1);
      if (typeIsNumber) {
        num *= parseInt(type, 10);
      }
      //if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
      if (
        Object.prototype.hasOwnProperty.call(ranges, range) &&
        !splt[1].match(/^mon(day|\.)?$/i)
      ) {
        return date["set" + ranges[range]](date["get" + ranges[range]]() + num);
      }
      if (range === "wee") {
        return date.setDate(date.getDate() + num * 7);
      }
      if (type === "next" || type === "last") {
        lastNext(type, range, num);
      } else {
        if (!typeIsNumber) {
          return false;
        }
      }
      return true;
    }
    times =
      "(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec" +
      "|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?" +
      "|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)";
    regex =
      "([+-]?\\d+\\s" + times + "|" + "(last|next)\\s" + times + ")(\\sago)?";
    match = text.match(new RegExp(regex, "gi"));
    if (!match) {
      return fail;
    }
    for (i = 0, len = match.length; i < len; i++) {
      if (!process(match[i])) {
        return fail;
      }
    }
    return date.getTime() / 1000;
  },
  /*变量处理*/
  isset: function() {
    var a = arguments,
      l = a.length,
      i = 0,
      undef;
    if (l === 0) {
      throw new Error("Empty isset");
    }
    while (i !== l) {
      if (a[i] === undef || a[i] === null) {
        return false;
      }
      i++;
    }
    return true;
  },
  empty: function(mixed_var) {
    var undef, key, i, len;
    var emptyValues = [undef, null, false, 0, "", "0"];
    for (i = 0, len = emptyValues.length; i < len; i++) {
      if (mixed_var === emptyValues[i]) {
        return true;
      }
    }
    if (typeof mixed_var === "object") {
      for (key in mixed_var) {
        return false;
      }
      return true;
    }
    return false;
  },
  intval: function(mixed_var, base) {
    var tmp;
    var type = typeof mixed_var;
    if (type === "boolean") {
      return +mixed_var;
    } else {
      if (type === "string") {
        tmp = parseInt(mixed_var, base || 10);
        return isNaN(tmp) || !isFinite(tmp) ? 0 : tmp;
      } else {
        if (type === "number" && isFinite(mixed_var)) {
          return mixed_var | 0;
        } else {
          return 0;
        }
      }
    }
  },
  function_exists: function(func_name) {
    if (typeof func_name === "string") {
      func_name = this.window[func_name];
    }
    return typeof func_name === "function";
  },
  in_array: function(needle, haystack, argStrict) {
    var key = "",
      strict = !!argStrict;
    if (strict) {
      for (key in haystack) {
        if (haystack[key] === needle) {
          return true;
        }
      }
    } else {
      for (key in haystack) {
        if (haystack[key] == needle) {
          return true;
        }
      }
    }
    return false;
  },
  range: function(low, high, step) {
    var matrix = [];
    var inival, endval, plus;
    var walker = step || 1;
    var chars = false;
    if (!isNaN(low) && !isNaN(high)) {
      inival = low;
      endval = high;
    } else {
      if (isNaN(low) && isNaN(high)) {
        chars = true;
        inival = low.charCodeAt(0);
        endval = high.charCodeAt(0);
      } else {
        inival = isNaN(low) ? 0 : low;
        endval = isNaN(high) ? 0 : high;
      }
    }
    plus = inival > endval ? false : true;
    if (plus) {
      while (inival <= endval) {
        matrix.push(chars ? String.fromCharCode(inival) : inival);
        inival += walker;
      }
    } else {
      while (inival >= endval) {
        matrix.push(chars ? String.fromCharCode(inival) : inival);
        inival -= walker;
      }
    }
    return matrix;
  },
  strip_tags: function(input, allowed) {
    allowed = (
      ((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []
    ).join("");
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
      commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input
      .replace(commentsAndPhpTags, "")
      .replace(tags, function($0, $1) {
        return allowed.indexOf("<" + $1.toLowerCase() + ">") > -1 ? $0 : "";
      });
  },
  rand: function(min, max) {
    var argc = arguments.length;
    if (argc === 0) {
      min = 0;
      max = 2147483647;
    } else {
      if (argc === 1) {
        throw new Error(
          "Warning: rand() expects exactly 2 parameters, 1 given"
        );
      }
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  round: function(value, precision, mode) {
    var m, f, isHalf, sgn;
    precision |= 0;
    m = Math.pow(10, precision);
    value *= m;
    sgn = (value > 0) | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);
    if (isHalf) {
      switch (mode) {
        case "PHP_ROUND_HALF_DOWN":
          value = f + (sgn < 0);
          break;
        case "PHP_ROUND_HALF_EVEN":
          value = f + (f % 2) * sgn;
          break;
        case "PHP_ROUND_HALF_ODD":
          value = f + !(f % 2);
          break;
        default:
          value = f + (sgn > 0);
      }
    }
    return (isHalf ? value : Math.round(value)) / m;
  },
  strtolower: function(str) {
    return (str + "").toLowerCase();
  },
  strtoupper: function(str) {
    return (str + "").toUpperCase();
  },
  floatval: function(mixed_var) {
    return parseFloat(mixed_var) || 0;
  },
  ucfirst: function(str) {
    str += "";
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
  },
  base_convert: function(number, frombase, tobase) {
    return parseInt(number + "", frombase | 0).toString(tobase | 0);
  },
  floor: function(value) {
    return Math.floor(value);
  },
  ceil: function(value) {
    return Math.ceil(value);
  },
  //字符串是否相同
  is_eq: function(str1, str2) {
    if (str1 == str2) {
      return true;
    } else {
      return false;
    }
  },
  //是否只包含数字
  is_num: function(num) {
    var reg = new RegExp("^[0-9]*$");
    return reg.test(num);
  },
  //电话号码 ^1\d{10}$
  is_phone: function(num) {
    var reg = /^1[3456789]\d{9}$/;
    return reg.test(num);
  },
  //qq号码
  is_qq: function(num) {
    var reg = /^[1-9]{1}\d{4,11}$/;
    return reg.test(num);
  },
  //邮箱
  is_email: function(num) {
    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(num);
  },
  //身份证号
  is_id: function(num) {
    var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
    return reg.test(num);
  },
  //都是中文
  is_chinese: function(num) {
    var reg = /[\u4e00-\u9fa5]/g;
    return reg.test(num);
  },
  is_reg: function(num) {
    var reg = /^([a-zA-z_]{1})([\w]*)$/g;
    return reg.test(num);
  },
  //固定电话
  is_tel: function(str) {
    var reg = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
    return reg.test(str);
  },
  //ip地址
  //is_ip:function(strIP){if(isNull(strIP)){return false}var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g;if(re.test(strIP)){if(RegExp.$1<256&&RegExp.$2<256&&RegExp.$3<256&&RegExp.$4<256){return true}}return false},
  is_zipcode: function(str) {
    var reg = /^(\d){6}$/;
    return reg.test(str);
  },
  is_english: function(str) {
    var reg = /^[A-Za-z]+$/;
    return reg.test(str);
  },
  //url地址
  //is_url:function(str){var reg=/^http:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;return reg.test(str)},
  //url 解析
  parse_url: function(url) {
    var a = document.createElement("a");
    a.href = url;
    return {
      source: url,
      protocol: a.protocol.replace(":", ""),
      host: a.hostname,
      port: a.port,
      query: a.search,
      params: (function() {
        var ret = {},
          seg = a.search.replace(/^\?/, "").split("&"),
          len = seg.length,
          i = 0,
          s;
        for (; i < len; i++) {
          if (!seg[i]) {
            continue;
          }
          s = seg[i].split("=");
          ret[s[0]] = s[1];
        }
        return ret;
      })(),
      file: (a.pathname.match(/\/([^/?#]+)$/i) || ["", ""])[1],
      hash: a.hash.replace("#", ""),
      path: a.pathname.replace(/^([^/])/, "/$1"),
      relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || ["", ""])[1],
      segments: a.pathname.replace(/^\//, "").split("/")
    };
  },
  //整型
  is_int: function(n, iMin, iMax) {
    if (!isFinite(n)) {
      return false;
    }
    if (!/^[+-]?\d+$/.test(n)) {
      return false;
    }
    if (iMin != undefined && parseInt(n) < parseInt(iMin)) {
      return false;
    }
    if (iMax != undefined && parseInt(n) > parseInt(iMax)) {
      return false;
    }
    return true;
  },
  //浮点型
  is_float: function(n, fMin, fMax) {
    if (!isFinite(n)) {
      return false;
    }
    if (fMin != undefined && parseFloat(n) < parseFloat(fMin)) {
      return false;
    }
    if (fMax != undefined && parseFloat(n) > parseFloat(fMax)) {
      return false;
    }
    return true;
  },
  is_http: function(url) {
    if (url.indexOf("http://") === -1 && url.indexOf("https://") === -1) {
      return false;
    }
    return true;
  },
  /**
   * 千分位统计
   * @param num
   * @returns {string}
   */
  numberThousandCheck: function(num) {
    let reg=/\d{1,3}(?=(\d{3})+$)/g;
    return (num + '').replace(reg, '$&,');
  },

  /**
   * uuid(v4)生成
   * @returns {string}
   */
  createGuid: function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  /*将结构树中的底层节点key名改为childrenNode*/
  reviseTreeData:function (data,list =[]) {
    for (let i=0; i < data.length; i++) {
      let sign= !!data[i].children;
      // data[i].hasChildren = false;
      // typeof data[i] === 'object' &&
      if (sign) {

        let childMenu = data[i].children.filter( vo => {
          if(vo.functionType !== '20'){
            return true;
          }
        });

        console.info(childMenu);

        if(childMenu.length){
          data[i].hasChildren = true;
          data[i].children = this.reviseTreeData(childMenu);
        }else{
          data[i].isLeaf = true;
          delete data[i].children;
        }

        /*if(data[i].functionType === "10"){
          //list[i].childrenNode=this.reviseTreeData(data[i].children);
          list[i].children = this.reviseTreeData(data[i].children);
          //delete list[i].children;
        }else{
          list[i].children=this.reviseTreeData(data[i].children);
        }*/
      } else {
        data[i].isLeaf = true;
      }
      list.push(data[i]);
    }
    // console.info("reviseTreeData ", list);
    return list;
  },
  formatToThousands(num){
    if(!num){
      return '0'
    }
    let number = num.toString();
    let result = '';
    const doshPosition = number.indexOf(".");
    let integer = '', decimal = '';

    if(doshPosition !== -1) {
      integer = number.slice(0, doshPosition);
      decimal = number.slice(doshPosition);
    } else {
      integer = number;
    }

    while (integer.length > 3) {
      result = `,${integer.slice(-3)}${result}`;
      integer = integer.slice(0, integer.length -3);
    }
    return `${integer}${result}${decimal}`
  },
  getQueryObject(url) {
    url = url == null ? window.location.href : url,
    url=url.replace('#','')
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1)
      let val = decodeURIComponent($2)
      val = String(val)
      obj[name] = val
      return rs
    })
    return obj
  },
  // 把所有访问路径添加到数组里，以便鉴权设置
  getChildUrls(node){
    let listUrl=[]
    if(node.children){
      for(var i in node.children){
        var list = this.getChildUrls(node.children[i])
        if(list.length > 0){
          for(var k in list){
            listUrl.push(list[k])
          }
        }
      }
    }
    if( 'function' !=typeof(node) && node.functionUrl && node.functionUrl.length > 0){
      if(node.functionUrl.indexOf("function")!=0){
        listUrl.push(node.functionUrl)
      }
    }
    return listUrl
  }
} ;

/*
 *  方法:Array.remove(dx) 通过遍历,重构数组
 *  功能:删除数组元素.
 *  参数:dx删除元素的下标.
 */
Array.prototype.remove = function(dx) {
  if (isNaN(dx) || dx > this.length) {
    return false;
  }
  for (var i = 0, n = 0; i < this.length; i++) {
    if (this[i] != this[dx]) {
      this[n++] = this[i];
    }
  }
  this.length -= 1;
};
