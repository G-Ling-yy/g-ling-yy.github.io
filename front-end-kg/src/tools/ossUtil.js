import store from "../store"
import OSS from "ali-oss";
import html2canvas from "html2canvas";
import { Notification, MessageBox } from 'element-ui'
import v from "vue";

let oss;
	
function getOssConfig(){
	if(oss==undefined){
		if(store.state.ossConfig.regionId==undefined){
			store.dispatch("getOssConfig")
		}
		return store.state.ossConfig
	}else{
		return oss
	}
}

function getOssClient(){
	// var config=getOssConfig()
	// return new OSS({
	//   endpoint: 'https://oss-cn-beijing.aliyuncs.com',
	//   accessKeyId: 'LTAI4G9t3f987KpwXMVZDnvq',
	//   accessKeySecret: 'b6XqhItb23ubW5StQ8LVfrAhwZhCND',
	//   bucket: 'gd-demo-file'
	// });
	return new OSS({
	  endpoint: config.regionId,
	  accessKeyId: config.accessKeyId,
	  accessKeySecret: config.accessKeySecret,
	  bucket: config.bucketName
	});
   }
function guid() {
    function S4() {
 return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var chars = ["a", "b", "c", "d", "e", "f",
			"g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
			"t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5",
			"6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I",
			"J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
			"W", "X", "Y", "Z" ];

/**uuid*/
function generateShortUuid() {
		var data='';
		var uuid = guid();
		for (var i = 0; i < 8; i++) {
			var str = uuid.substring(i * 4, i * 4 + 4);
			var x = ex16hex(str);
			data+=chars[x % 0x3E];
		}
		return data;
}
// 16进制数转10进制
var ex16hex = function(value){
  value = stripscript(value);
    value = value.replace("0x","");
  var arr = value.split("");
  arr = arr.reverse();
  var len = arr.length;
  var res = 0;
  for(var i in arr){
	 var num = hex_change(arr[i]);
	 res += muti16(num, i); 
  }
  return res;
}

// 字符转16进制数字
var hex_change = function(v){
    var res;
    switch(v){
case "a": res = 10;break;
    case "b": res = 11;break;
    case "c": res = 12;break;
    case "d": res = 13;break;
    case "e": res = 14;break;
    case "f": res = 15;break;
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9": res = Number(v);break;
    default: res = 0;break;
  }
  return res;
}

// 过滤所有特殊字符
var stripscript = function(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？↵\r\n]");
  var rs = "";
    for (var i = 0; i < s.length; i++) {
  rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

// 返回 v 乘以 n 个 16 的积
var muti16 = function(v, n){
  var temp = v;
    for(var i = 0; i < n; i++){
    temp *= 16;
  }
  return temp;
}

function resetFilePath(caremaNum,suffix){
	return "/"+caremaNum+"/"+parseTime(new Date(),'{y}{m}{d}')+"/"+generateShortUuid()+"."+suffix;
}
function resetFilePathWithModule(caremaNum,module,suffix){
	return "/"+caremaNum+"/"+module+"/"+parseTime(new Date(),'{y}{m}{d}')+"/"+generateShortUuid()+"."+suffix;
}

/**时间格式化*/
function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'undefined' || time === null || time === 'null') {
    return ''
  } else if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
		time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
		time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
		value = '0' + value
    }
    return value || 0
  })
  return time_str
}

function uploadFileToOss(fileName,file){
	var client=getOssClient();
	var _this=this;
	return new Promise(function(resolve,reject){
		client.multipartUpload(fileName, file)
		  .then(res => {
		    if (res && res.res.status == 200) {
				resolve({filePath:fileName,status:true,data:res})
		    }else{
				reject({filePath:fileName,status:false,data:res})
			}
		  })
		  .catch(res => {
			  reject({filePath:fileName,status:false,data:res})
		  });
	});
	
	  // client.multipartUpload("fileName/" + filename, el.files[0]).then(function (result){
	  //   var url = result.res.requestUrls[0];
	  //   var length = url.lastIndexOf('?');
	  //   var imgUrl = length>0?url.substr(0,length):url; // 文件最终路径
	  //   console.log(imgUrl);
	  //     }).catch(function (err) {
	  //   console.log(err);
	  //     });
}
function getBlob (canvas) { //获取blob对象
	var data = canvas.toDataURL("image/jpeg", 1);
	data = data.split(',')[1];
	data = window.atob(data);
	var ia = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) {
		ia[i] = data.charCodeAt(i);
	}
	return new Blob([ia], {type: "image/jpeg"});
}

/**上传视频文件*/
const uploadVideo=function(caremaNum,file){
	return uploadFile(caremaNum,'video','mp4',file);
}
/**上传图片文件*/
const uploadImage=function(caremaNum,file){
	return uploadFile(caremaNum,'image','jpg',file);
}
const uploadFile=function(caremaNum,module,type,file){
	var fileName=resetFilePathWithModule(caremaNum,module,type);
	return uploadFileToOss(fileName,file)
}

const getFileUrl=function(path){
	var client=getOssClient();
	return client.signatureUrl(path, {expires: 300})
}

const snapshot=function(node,func){
		
	if(node==undefined){
		node=document.body
	}
	var canvas2 = document.createElement("canvas");
	// let _canvas = document.getElementById('child');
	let _canvas = node;
	var w = parseInt(window.getComputedStyle(_canvas).width);
	var h = parseInt(window.getComputedStyle(_canvas).height);
	//将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了  
	canvas2.width = w * 4;
	canvas2.height = h * 4;
	canvas2.style.width = w + "px";
	canvas2.style.height = h + "px";
	//可以按照自己的需求，对context的参数修改,translate指的是偏移量  
	var context = canvas2.getContext("2d");
	context.scale(2, 2);
	html2canvas(node, {
		canvas: canvas2,
       backgroundColor:null,//画出来的图片有白色的边框,不要可设置背景为透明色（null）
       useCORS: true,//支持图片跨域
       scale:1,//设置放大的倍数
     })
	.then(function (canvas) {
		console.log(canvas)
		//截图成功
		var blob = getBlob(canvas);
		if(func !=undefined){
			func({data:blob,path:canvas.toDataURL("image/jpeg", 1)})
		}
	});
}



export default {
	uploadVideo,
	uploadImage,
	snapshot,
	getFileUrl
}