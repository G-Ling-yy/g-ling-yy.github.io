(function(e){function t(t){for(var r,a,i=t[0],u=t[1],c=t[2],l=0,f=[];l<i.length;l++)a=i[l],Object.prototype.hasOwnProperty.call(s,a)&&s[a]&&f.push(s[a][0]),s[a]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);p&&p(t);while(f.length)f.shift()();return o.push.apply(o,c||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,a=1;a<n.length;a++){var i=n[a];0!==s[i]&&(r=!1)}r&&(o.splice(t--,1),e=u(u.s=n[0]))}return e}var r={},a={app:0},s={app:0},o=[];function i(e){return u.p+"assets/js/"+({about:"about"}[e]||e)+"."+{about:"b9f3de77"}[e]+".js"}function u(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(e){var t=[],n={about:1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise((function(t,n){for(var r="assets/css/"+({about:"about"}[e]||e)+"."+{about:"164d1f05"}[e]+".css",s=u.p+r,o=document.getElementsByTagName("link"),i=0;i<o.length;i++){var c=o[i],l=c.getAttribute("data-href")||c.getAttribute("href");if("stylesheet"===c.rel&&(l===r||l===s))return t()}var f=document.getElementsByTagName("style");for(i=0;i<f.length;i++){c=f[i],l=c.getAttribute("data-href");if(l===r||l===s)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var r=t&&t.target&&t.target.src||s,o=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");o.code="CSS_CHUNK_LOAD_FAILED",o.request=r,delete a[e],p.parentNode.removeChild(p),n(o)},p.href=s;var d=document.getElementsByTagName("head")[0];d.appendChild(p)})).then((function(){a[e]=0})));var r=s[e];if(0!==r)if(r)t.push(r[2]);else{var o=new Promise((function(t,n){r=s[e]=[t,n]}));t.push(r[2]=o);var c,l=document.createElement("script");l.charset="utf-8",l.timeout=120,u.nc&&l.setAttribute("nonce",u.nc),l.src=i(e);var f=new Error;c=function(t){l.onerror=l.onload=null,clearTimeout(p);var n=s[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;f.message="Loading chunk "+e+" failed.\n("+r+": "+a+")",f.name="ChunkLoadError",f.type=r,f.request=a,n[1](f)}s[e]=void 0}};var p=setTimeout((function(){c({type:"timeout",target:l})}),12e4);l.onerror=l.onload=c,document.head.appendChild(l)}return Promise.all(t)},u.m=e,u.c=r,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(n,r,function(t){return e[t]}.bind(null,r));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="",u.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=t,c=c.slice();for(var f=0;f<c.length;f++)t(c[f]);var p=l;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"2d86":function(e,t,n){"use strict";n("eb75")},"4ee2":function(e,t,n){},"6f23":function(e,t,n){},"7bca":function(e,t,n){"use strict";n("6f23")},8167:function(e,t,n){},b32e:function(e,t,n){"use strict";n("8167")},cd49:function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var e=this,t=e._self._c;e._self._setupProxy;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},s=[],o=n("bee2"),i=n("d4ec"),u=n("262e"),c=n("2caf"),l=n("60a3"),f=function(e){Object(u["a"])(n,e);var t=Object(c["a"])(n);function n(){return Object(i["a"])(this,n),t.apply(this,arguments)}return Object(o["a"])(n)}(l["a"]),p=f,d=(n("2d86"),n("2877")),v=Object(d["a"])(p,a,s,!1,null,null,null),h=v.exports,b=(n("d3b7"),n("3ca3"),n("ddb0"),n("8c4f")),m=(n("b0c0"),function(){var e=this,t=e._self._c;return t("div",{staticClass:"home"},[t("header",[t("div",{staticClass:"texts"},[t("h1",[e._v(e._s(e.isGetData?e.user.name||"(user数据为空)":"loading···"))]),e._m(0)]),t("div",{staticClass:"avatar-wrapper"},[e.user.avatar?t("img",{staticClass:"avatar",attrs:{src:e.user.avatar,alt:""}}):t("div",{staticClass:"default-avatar"},[t("div",{staticClass:"left-eye"}),t("div",{staticClass:"right-eye"}),t("div",{staticClass:"mouth"})])])]),t("main",e._l(e.user.blocks,(function(e,n){return t("Block",{key:n,attrs:{blockValue:e}})})),1),t("footer",{directives:[{name:"show",rawName:"v-show",value:e.isGetData&&e.user.name,expression:"isGetData && user.name"}]},[e._v(" 感谢您花时间阅读我的简历，期待能有机会与优秀的您共事。 ")])])}),_=[function(){var e=this,t=e._self._c;return t("div",{staticClass:"profile"},[t("p",[t("span",[e._v("男")]),t("span",[e._v("94.11")]),t("span",[e._v("6年")]),t("span",[e._v("Web前端")])]),t("p",[t("span",[e._v("18860913014")]),t("span",[e._v("934830721@qq.com")])])])}],y=function(){var e=this,t=e._self._c;return t("div",{staticClass:"block-comp"},[t("div",{staticClass:"title"},[e._v(e._s(e.blockValue.title||"title"))]),t("div",{staticClass:"content",class:"column-".concat(e.blockValue.columns)},e._l(e.blockValue.options,(function(n,r){return t("div",{key:r,staticClass:"option"},[t("div",{staticClass:"key"},[e._v(" "+e._s(n.key||"option.key")+" "),n.tip?t("p",{staticClass:"tip"},[e._v("("+e._s(n.tip)+")")]):e._e()]),"null"!==n.value?t("div",{staticClass:"value"},[e._v(e._s(n.value||"option.value"))]):e._e(),n.details&&n.details.length?t("ul",e._l(n.details,(function(n,r){return t("li",{key:r},[e._v(e._s(n))])})),0):e._e()])})),0),e._m(0)])},g=[function(){var e=this,t=e._self._c;return t("div",{staticClass:"paperclip"},[t("div",{staticClass:"inner"})])}],C={props:{blockValue:{type:Object,default:function(){return{}}}}},k=C,w=(n("7bca"),Object(d["a"])(k,y,g,!1,null,"8805a568",null)),j=w.exports,O={name:"Home",data:function(){return{isGetData:!1,user:{}}},components:{Block:j},created:function(){var e=this;fetch("./userData.json").then((function(e){return e.json()})).then((function(t){e.isGetData=!0,e.user=t.user}))}},x=O,P=(n("b32e"),Object(d["a"])(x,m,_,!1,null,"a7cc9678",null)),E=P.exports;r["a"].use(b["a"]);var D=[{path:"/",name:"Home",component:E},{path:"*",name:"Error",component:function(){return n.e("about").then(n.bind(null,"dda8"))}}],S=new b["a"]({mode:"history",base:"/MyResumeDemo_v20/dist/",routes:D}),T=S;n("4ee2");r["a"].config.productionTip=!1,new r["a"]({router:T,render:function(e){return e(h)}}).$mount("#app")},eb75:function(e,t,n){}});
//# sourceMappingURL=app.800274ee.js.map