(function(e){function t(t){for(var r,a,i=t[0],u=t[1],c=t[2],l=0,f=[];l<i.length;l++)a=i[l],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&f.push(o[a][0]),o[a]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);d&&d(t);while(f.length)f.shift()();return s.push.apply(s,c||[]),n()}function n(){for(var e,t=0;t<s.length;t++){for(var n=s[t],r=!0,a=1;a<n.length;a++){var i=n[a];0!==o[i]&&(r=!1)}r&&(s.splice(t--,1),e=u(u.s=n[0]))}return e}var r={},a={app:0},o={app:0},s=[];function i(e){return u.p+"assets/js/"+({about:"about"}[e]||e)+"."+{about:"ebbe02ac"}[e]+".js"}function u(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(e){var t=[],n={about:1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise((function(t,n){for(var r="assets/css/"+({about:"about"}[e]||e)+"."+{about:"bdceadb9"}[e]+".css",o=u.p+r,s=document.getElementsByTagName("link"),i=0;i<s.length;i++){var c=s[i],l=c.getAttribute("data-href")||c.getAttribute("href");if("stylesheet"===c.rel&&(l===r||l===o))return t()}var f=document.getElementsByTagName("style");for(i=0;i<f.length;i++){c=f[i],l=c.getAttribute("data-href");if(l===r||l===o)return t()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=t,d.onerror=function(t){var r=t&&t.target&&t.target.src||o,s=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");s.code="CSS_CHUNK_LOAD_FAILED",s.request=r,delete a[e],d.parentNode.removeChild(d),n(s)},d.href=o;var p=document.getElementsByTagName("head")[0];p.appendChild(d)})).then((function(){a[e]=0})));var r=o[e];if(0!==r)if(r)t.push(r[2]);else{var s=new Promise((function(t,n){r=o[e]=[t,n]}));t.push(r[2]=s);var c,l=document.createElement("script");l.charset="utf-8",l.timeout=120,u.nc&&l.setAttribute("nonce",u.nc),l.src=i(e);var f=new Error;c=function(t){l.onerror=l.onload=null,clearTimeout(d);var n=o[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;f.message="Loading chunk "+e+" failed.\n("+r+": "+a+")",f.name="ChunkLoadError",f.type=r,f.request=a,n[1](f)}o[e]=void 0}};var d=setTimeout((function(){c({type:"timeout",target:l})}),12e4);l.onerror=l.onload=c,document.head.appendChild(l)}return Promise.all(t)},u.m=e,u.c=r,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(n,r,function(t){return e[t]}.bind(null,r));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="",u.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=t,c=c.slice();for(var f=0;f<c.length;f++)t(c[f]);var d=l;s.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"280b":function(e,t,n){"use strict";var r=n("c667"),a=n.n(r);a.a},"2f5c":function(e,t,n){"use strict";var r=n("5f10"),a=n.n(r);a.a},"4ee2":function(e,t,n){},"5c0b":function(e,t,n){"use strict";var r=n("9c0c"),a=n.n(r);a.a},"5f10":function(e,t,n){},"9c0c":function(e,t,n){},c667:function(e,t,n){},cd49:function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},o=[],s=n("d4ec"),i=n("99de"),u=n("7e84"),c=n("262e"),l=n("60a3"),f=function(e){function t(){return Object(s["a"])(this,t),Object(i["a"])(this,Object(u["a"])(t).apply(this,arguments))}return Object(c["a"])(t,e),t}(l["a"]),d=f,p=(n("5c0b"),n("2877")),v=Object(p["a"])(d,a,o,!1,null,null,null),h=v.exports,m=(n("d3b7"),n("8c4f")),b=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"home"},[n("header",[n("div",{staticClass:"avatar-wrapper"},[e.user.avatar?n("img",{staticClass:"avatar",attrs:{src:e.user.avatar,alt:""}}):n("div",{staticClass:"default-avatar"},[n("div",{staticClass:"left-eye"}),n("div",{staticClass:"right-eye"}),n("div",{staticClass:"mouth"})])]),n("div",{staticClass:"texts"},[n("h1",[e._v(e._s(e.isGetData?e.user.name||"(user数据为空)":"loading···"))]),n("div",{staticClass:"profile"},[e._v(e._s(e.user.profileText))])])]),n("main",e._l(e.user.blocks,(function(e,t){return n("Block",{key:t,attrs:{blockValue:e}})})),1),n("footer",{directives:[{name:"show",rawName:"v-show",value:e.isGetData&&e.user.name,expression:"isGetData && user.name"}]},[e._v(" 感谢您花时间阅读我的简历，期待能有机会和您共事。 ")])])},y=[],g=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"block-comp"},[n("div",{staticClass:"title"},[e._v(e._s(e.blockValue.title||"title"))]),n("div",{staticClass:"content",class:[1==e.blockValue.columns&&"oneColumn"]},e._l(e.blockValue.options,(function(t,r){return n("div",{key:r,staticClass:"option"},[n("div",{staticClass:"key"},[e._v(" "+e._s(t.key||"option.key")+" "),t.tip?n("p",{staticClass:"tip"},[e._v("("+e._s(t.tip)+")")]):e._e()]),n("div",{staticClass:"value"},[e._v(e._s(t.value||"option.value"))]),t.details&&t.details.length?n("ul",e._l(t.details,(function(t,r){return n("li",{key:r},[e._v(e._s(t))])})),0):e._e()])})),0)])},_=[],C={props:{blockValue:{type:Object,default:function(){return{}}}}},k=C,w=(n("2f5c"),Object(p["a"])(k,g,_,!1,null,"048f5a9a",null)),j=w.exports,O={name:"Home",data:function(){return{isGetData:!1,user:{}}},components:{Block:j},created:function(){var e=this;fetch("./userData.json").then((function(e){return e.json()})).then((function(t){e.isGetData=!0,e.user=t.user}))}},x=O,E=(n("280b"),Object(p["a"])(x,b,y,!1,null,"25a99cd3",null)),P=E.exports;r["a"].use(m["a"]);var D=[{path:"/",name:"Home",component:P},{path:"*",name:"Error",component:function(){return n.e("about").then(n.bind(null,"dda8"))}}],S=new m["a"]({mode:"history",base:"/MyResumeDemo_v20/dist/",routes:D}),T=S;n("4ee2");r["a"].config.productionTip=!1,new r["a"]({router:T,render:function(e){return e(h)}}).$mount("#app")}});
//# sourceMappingURL=app.7deae5c3.js.map