(function(t){function e(e){for(var i,s,r=e[0],u=e[1],c=e[2],p=0,h=[];p<r.length;p++)s=r[p],a[s]&&h.push(a[s][0]),a[s]=0;for(i in u)Object.prototype.hasOwnProperty.call(u,i)&&(t[i]=u[i]);l&&l(e);while(h.length)h.shift()();return o.push.apply(o,c||[]),n()}function n(){for(var t,e=0;e<o.length;e++){for(var n=o[e],i=!0,r=1;r<n.length;r++){var u=n[r];0!==a[u]&&(i=!1)}i&&(o.splice(e--,1),t=s(s.s=n[0]))}return t}var i={},a={app:0},o=[];function s(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=t,s.c=i,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)s.d(n,i,function(e){return t[e]}.bind(null,i));return n},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],u=r.push.bind(r);r.push=e,r=r.slice();for(var c=0;c<r.length;c++)e(r[c]);var l=u;o.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"16f1":function(t,e,n){},1867:function(t,e,n){"use strict";var i=n("60dd"),a=n.n(i);a.a},2221:function(t,e,n){"use strict";var i=n("a710"),a=n.n(i);a.a},2598:function(t,e,n){"use strict";var i=n("e08b"),a=n.n(i);a.a},"3a43":function(t,e,n){"use strict";var i=n("56d1"),a=n.n(i);a.a},"4ee2":function(t,e,n){},"56d1":function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var i=n("2b0e"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},o=[],s=(n("bbdd"),n("2877")),r={},u=Object(s["a"])(r,a,o,!1,null,"707e4a6a",null),c=u.exports,l=n("8c4f"),p=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"page-container home"},[n("VonHead",[n("div",{staticClass:"title white",attrs:{slot:"middle"},slot:"middle"},[t._v("时间刚刚好")])]),n("div",{staticClass:"content-wrapper"},[n("div",{staticClass:"content"},[n("select",{directives:[{name:"model",rawName:"v-model",value:t.peopleCount,expression:"peopleCount"}],ref:"peopleCountSelect",on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){var e="_value"in t?t._value:t.value;return e});t.peopleCount=e.target.multiple?n:n[0]}}},[n("option",{attrs:{value:"1"}},[t._v("1")]),n("option",{attrs:{value:"2"}},[t._v("2")]),n("option",{attrs:{value:"3"}},[t._v("3")]),n("option",{attrs:{value:"4"}},[t._v("4")]),n("option",{attrs:{value:"5"}},[t._v("5")]),n("option",{attrs:{value:"6"}},[t._v("6")])])]),n("p",[t._v("误差超过0.1秒将接受惩罚")]),n("div",{staticClass:"start-btn",on:{touchstart:t.onClickStart,click:t.onClickStart}})])],1)},h=[],d=(n("c5f6"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"v-on-head"},[t._t("left"),t._t("middle"),t._t("right")],2)}),m=[],v={},f=v,C=(n("1867"),Object(s["a"])(f,d,m,!1,null,"e124641c",null)),y=C.exports,b=localStorage.getItem("peopleCount")&&Number(localStorage.getItem("peopleCount"))||1,_=i["a"].observable({peopleCount:b}),g={setPeopleCount:function(t){_.peopleCount=t,localStorage.setItem("peopleCount",t)}},k={name:"home",components:{VonHead:y},computed:{peopleCount:{get:function(){return _.peopleCount},set:function(t){g.setPeopleCount(Number(t))}}},methods:{onClickStart:function(t){t.preventDefault(),this.$router.push({path:"/game"})}}},w=k,O=(n("e470"),Object(s["a"])(w,p,h,!1,null,"c5f2fc32",null)),x=O.exports,S=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"page-container game"},[n("VonHead",[n("div",{staticClass:"back-arrow white",attrs:{slot:"left"},on:{click:function(e){return t.$router.push({path:"/"})}},slot:"left"}),n("div",{staticClass:"title white",attrs:{slot:"middle"},slot:"middle"},[t._v("时间刚刚好")])]),n("div",{class:["timer-wrapper","count-"+t.peopleCount]},[t._l(t.timerOptionArray,function(e){return n("div",{key:e.id,class:[t.peopleCount<4&&"diamont-timer",t.peopleCount>3&&"square-timer","timer"+e.id,e.isFixed&&"timeover"]},[n("TimeCalculator",{class:{diamont:t.peopleCount<4},attrs:{timeCount:t.timeCount,timerOption:e},on:{clickFixed:t.clickFixed}})],1)})],2),n("div",{directives:[{name:"show",rawName:"v-show",value:t.isLayerShow,expression:"isLayerShow"}],staticClass:"layer"},[t.isGameOver?t._e():[n("div",{staticClass:"border-btn start-btn",on:{click:t.onClickStart}})],t.isGameOver?[t.peopleCount>1?n("div",{staticClass:"marks-wrapper"},t._l(t.timerOptionArray,function(e){return n("div",{key:e.id,class:["mark",e.isLoser&&"loser"]},[t._v("\n\t\t\t\t\t"+t._s(e.name)+" "+t._s(e.timeCount)+"\n\t\t\t\t")])}),0):1!==t.peopleCount||t.oneSuccess?1===t.peopleCount&&t.oneSuccess?n("div",{staticClass:"one-player"},[n("div",{staticClass:"end-time"},[t._v(t._s(t.timerOptionArray[0].timeCount))]),n("p",[t._v("真是神手速")])]):t._e():n("div",{staticClass:"one-player"},[n("div",{staticClass:"end-time"},[t._v(t._s(t.timerOptionArray[0].timeCount))]),n("p",[t._v("还是"+t._s(t.i<t.standard-t.applyRange?"快":"慢")+"了一点")]),n("p",[t._v("乖乖接受惩罚吧！")])]),t.oneSuccess?t._e():n("div",{staticClass:"border-btn punish-btn",on:{touchend:t.onClickPunish,click:t.onClickPunish}}),t.oneSuccess?n("div",{staticClass:"border-btn one-again-btn",on:{touchend:t.Reset,click:t.Reset}}):t._e(),t.oneSuccess?t._e():n("div",{staticClass:"again-btn",on:{touchend:t.Reset,click:t.Reset}})]:t._e()],2)],1)},j=[],A=(n("5df3"),n("1c4c"),n("55dd"),n("7514"),n("ac6a"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"calculator-container",on:{touchstart:t.onClickSelf,click:t.onClickSelf}},[n("div",{staticClass:"wrapper"},[n("div",{staticClass:"calculator-time"},[t._v(t._s(t.timerOption.timeCount?t.timerOption.timeCount:t.timeCount))]),n("div",{staticClass:"tip"},[t._v(t._s(t.timerOption.isFixed?"已定格":"点击定格"))])])])}),$=[],W={props:{timerOption:{type:Object,default:function(){return{id:0,timeCount:null,isFixed:!1}}},timeCount:{type:String,default:"0.00"}},data:function(){return{}},computed:{},watch:{},methods:{onClickSelf:function(t){t.preventDefault(),this.timerOption.timeCount||this.$emit("clickFixed",this.timerOption.id)}}},L=W,P=(n("6e38"),Object(s["a"])(L,A,$,!1,null,"5cb4eed9",null)),F=P.exports,N={name:"game",data:function(){return{isLayerShow:!0,isGameOver:!1,i:0,interval:null,timerOptionArray:[],standard:500,applyRange:10}},components:{VonHead:y,TimeCalculator:F},computed:{peopleCount:{get:function(){return _.peopleCount},set:function(t){g.setPeopleCount(t)}},timeCount:function(){return(this.i/100).toFixed(2)},oneSuccess:function(){return 1===_.peopleCount&&Math.abs(this.i-this.standard)<=this.applyRange}},methods:{onClickStart:function(){var t=this;this.isLayerShow=!1,this.timersStart=!0,this.interval=setInterval(function(){t.i++,t.i>=999&&(clearInterval(t.interval),t.isGameOver=!0,t.isLayerShow=!0,t.timerOptionArray.forEach(function(e){e.isLoser=null===e.timeCount,e.isFixed=!0,!e.timeCount&&(e.timeCount=t.timeCount)}))},10)},clickFixed:function(t){var e=this.timerOptionArray.find(function(e){return e.id===t});if(e.timeCount=this.timeCount,e.isFixed=!0,1===this.peopleCount)return this.isGameOver=!0,this.isLayerShow=!0,void clearInterval(this.interval);this.checkOver()},checkOver:function(){this.timerOptionArray.every(function(t){return t.isFixed})&&(this.getLosers(),this.isGameOver=!0,this.isLayerShow=!0,clearInterval(this.interval))},getLosers:function(){var t=this,e=this.timerOptionArray.map(function(t){return t}).sort(function(e,n){return Math.abs(n.timeCount-t.standard)-Math.abs(e.timeCount-t.standard)})[0];e.isLoser=!0,this.timerOptionArray.filter(function(t){t.timeCount===e.timeCount&&(t.isLoser=!0)})},onClickPunish:function(t){t.preventDefault(),this.$router.push({path:"/punishment"})},Reset:function(t){t.preventDefault(),clearInterval(this.interval),this.i=0,this.interval=null,this.isGameOver=!1,this.initialData()},initialData:function(){var t={1:"玩家一",2:"玩家二",3:"玩家三",4:"玩家四",5:"玩家五",6:"玩家六"};this.timerOptionArray=Array.from(new Array(this.peopleCount)).map(function(e,n){return{id:++n,name:t[n],timeCount:null,isFixed:!1}})}},created:function(){this.initialData()}},D=N,T=(n("2221"),n("3a43"),Object(s["a"])(D,S,j,!1,null,"7b71aafb",null)),E=T.exports,M=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},I=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"about"},[n("h1",[t._v("This is an about page")])])}],R={},G=Object(s["a"])(R,M,I,!1,null,null,null),H=G.exports,q=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"page-container punishment-container"},[n("von-head",{directives:[{name:"show",rawName:"v-show",value:!t.punishWay,expression:"!punishWay"}]},[n("div",{staticClass:"back-arrow white",attrs:{slot:"left"},on:{click:function(e){return t.$router.push({path:"/"})}},slot:"left"})]),n("div",{staticClass:"punishment-title"}),n("div",{staticClass:"ways-wrapper"},t._l(t.ways,function(e){return n("div",{key:e.name,staticClass:"way",on:{click:function(n){return t.onClickWay(e.imgName)}}},[n("img",{attrs:{src:"https://vxiaocheng-jh.oss-cn-beijing.aliyuncs.com/H5_games/punishment/"+e.imgName+".png"}})])}),0),n("div",{staticClass:"try-again",on:{click:t.onClickAgain}}),n("div",{directives:[{name:"show",rawName:"v-show",value:t.punishWay,expression:"punishWay"}],staticClass:"layer"},[n("div",{class:["punishment-card",""+t.punishWay]},[n("p",{staticClass:"punish-text"},[t._v(t._s(t.punishText))]),n("div",{staticClass:"another-btn",on:{click:t.onClickAnother}},[t._v("换一个")])]),n("div",{staticClass:"close-btn",on:{click:t.onClickCloseSelect}})]),t._e()],1)},V=[],J=n("d225"),z=n("b0b4"),B=function(){function t(){Object(J["a"])(this,t),this.data={},this.setData(),this.getData()}return Object(z["a"])(t,[{key:"getData",value:function(){}},{key:"setData",value:function(){this.data={envelope:["发8.88元给在场所有人","发2.66元给在场最敬佩的同性","发1.88元给在场所有同性","发6.88元给在场所有同性","发8.99元给在场最敬佩的同性","发5.99元给在场最敬佩的同性","发2.88元给在场最敬佩的同性","发1.99元给在场最喜欢的异性","发9.88元给在场最喜欢的异性","发0.88元给在场最喜欢的异性"],drink:["喝一杯","敬在场的所有同性酒","不喝","杯子里喝光","随意加酒","找人干杯","随意喝","抽中三次免单","找一个异性喝交杯酒","上家喝光","喝两杯","随意减酒","喝一瓶","喝三杯","给任意一个人倒满","敬在场的所有异性酒"],truth:["你和在座的一位异性都干过恋人之间的什么事","上一次接吻的是什么时候？和谁？","生过的最严重的病是什么？","只给你一天时间当异性，你最想做什么？","觉得自己脸皮厚还是薄","你最不能忍受左边的人的哪一点？","你的初恋对象是谁？","打算什么时候结婚？","大学所有考试中，你考到最低的一门是什么课，考了几分？","最后一次发自内心的笑是什么时候？","对梦中情人有什么要求(在一分钟内说出五条)","你觉得最美的画面是什么？","你身上有没有胎记？长在什么地方，什么形状？","如果时间能倒流你希望回到哪一时间？","和恋人的身体接触到哪一步了","在现场所有同学中，你看哪位异性同学最舒服？","为什么男人不坏，女人不爱？","你觉得活着的意义是什么？","如果有来生，你选择当？","你接受姐弟恋吗？几岁的范围可以接受？","你最短的一次恋爱是什么情况"],risk:["女生仰躺地上，男生撑在上面，做五个俯卧撑","和在场的一个异性拥抱三分钟","对着天空大叫本公子(姑娘)卖身不卖艺","与一位异性十指相扣，对视10秒","选个人查看你手机的所有照片并允许展示给大家","把右边第一个异性横抱起来","饶你一命，换下个人","大喊两声“我是禽兽，猪狗不如”","手指蘸上食物，用最性感的方式舔完","选一个人跟你离开房间五分钟","模仿脑白金广告，边唱边跳","拔一根鼻毛或腿毛","拜托一个男生和一个女生当众亲密拥抱一分钟","哭泣状并深情亲吻墙壁10秒","轻咬右侧第二位的耳垂","和右边第一个异性关在厕所里等一轮游戏","一秒钟变格格","原地转10圈(就近靠下)","跟出门遇见的第一个异性说我喜欢你或者要微信","对窗外大喊“我好寂寞啊”","抱一位异性直到下一轮真心话大冒险结束","将一位异性堵到角落里，深情对视三分钟","给前任发微信：我真的离不开你，你能不能回到我身边陪我","让在场的异性给你种个小草莓"]}}}]),t}(),K=new B,Q=K,U={data:function(){return{ways:[{name:"发红包",imgName:"envelope"},{name:"喝酒",imgName:"drink"},{name:"真心话",imgName:"truth"},{name:"大冒险",imgName:"risk"}],punishWay:"",punishText:""}},computed:{},methods:{onClickWay:function(t){this.punishWay=t,this.onClickAnother()},onClickAgain:function(){this.$router.push({path:"/game"})},onClickAnother:function(){var t=Math.floor(Math.random()*Q.data[this.punishWay].length);this.punishText!==Q.data[this.punishWay][t]?this.punishText=Q.data[this.punishWay][t]:this.onClickAnother()},onClickCloseSelect:function(){this.punishWay=""}},created:function(){this.$route.query&&this.$route.query.punishWay&&this.onClickWay(this.$route.query.punishWay)}},X=U,Y=(n("2598"),n("e187"),Object(s["a"])(X,q,V,!1,null,"a6aa2f5e",null)),Z=Y.exports;i["a"].use(l["a"]);var tt=new l["a"]({mode:"hash",base:"/",routes:[{path:"/",name:"home",component:x},{path:"/game",name:"game",component:E},{path:"/punishment",name:"Punishment",component:Z},{path:"/about",name:"about",component:H}]});n("4ee2");i["a"].component("von-head",y),i["a"].config.productionTip=!1,new i["a"]({router:tt,render:function(t){return t(c)}}).$mount("#app")},"5ecd":function(t,e,n){},"60dd":function(t,e,n){},"6e38":function(t,e,n){"use strict";var i=n("eab3"),a=n.n(i);a.a},"7f7e":function(t,e,n){},a710:function(t,e,n){},bbdd:function(t,e,n){"use strict";var i=n("7f7e"),a=n.n(i);a.a},e08b:function(t,e,n){},e187:function(t,e,n){"use strict";var i=n("16f1"),a=n.n(i);a.a},e470:function(t,e,n){"use strict";var i=n("5ecd"),a=n.n(i);a.a},eab3:function(t,e,n){}});
//# sourceMappingURL=app.458d4cee.js.map