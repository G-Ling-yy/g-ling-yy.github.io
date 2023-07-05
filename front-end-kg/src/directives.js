import Vue from "vue";
import md5 from "js-md5";
/**权限指令**/
const btnHasPermission = Vue.directive("hasPermiss", {
  inserted: function(el, binding, vnode) {
    //console.info('insert ',el,binding,vnode);
    // 获取按钮权限
    let btnPermissions = binding.value; //vnode.context.$route.meta.btnPermissions.split(",");
    if (!Vue.prototype.$_btnPermissionCheck(btnPermissions + "")) {
      el.parentNode.removeChild(el);
      //el.style.display = 'none';
      //return
    }
    //el.style.display = 'inline-block';
  }
});
// 权限检查方法
Vue.prototype.$_btnPermissionCheck = function(value) {
  let isExist = false;
  let locals = localStorage.getItem("PM_CK_BN");
  if (!locals) {
    return false;
  }

  let arr = JSON.parse(locals),
    btnPermissionsStr = arr.data,
    sign = arr.sign,
    skey =
      "*……%F%……&FCVW……&#V*&CIE……B&*CF……VFdF*&V%RV*rd*&vrvfdvfsaf&……t&*FfvsfdvfbFFFGFfggug7866t%￥&￥&%*……";
  // console.info(sign, md5(btnPermissionsStr+skey));
  if (sign && md5(btnPermissionsStr + skey) === sign) {
    let permArr = btnPermissionsStr.split(",");
    // console.log(permArr,"permArr")
    value = value + "";

    // number型不能使用indexOf
    if (value && value.indexOf(",") > 0) {
      let ar = value.split(",");
      ar.forEach((vo, idx) => {
        if (permArr.indexOf(vo) > -1) {
          isExist = true;
        }
      });
      //console.info('asdvadsv  adsva  ',value);
      return isExist;
    }
    if (permArr.indexOf(value) > -1) {
      isExist = true;
    }

    //console.info('value  ',value,permArr,permArr.indexOf(value),isExist);
  }

  //console.info('inserted ',btnPermissionsStr,value.indexOf(btnPermissionsStr));

  return isExist;
};

/*

*  使用方法

*  将以下代码复制到一个js文件中，然后在入口文件main.js中import引入即可；

*  给elementUI的dialog上加上 v-dialogDrag 指令就可以实现弹窗的全屏和拉伸了。

*  给dialog设置 :close-on-click-modal="false" , 禁止点击遮罩层关闭弹出层

*  如果是form表单，不要将提交等按钮放置el-form-item，以免在上下拉伸时被隐藏

*  fullScreen 参数控制能否双击全屏

*/

// v-dialogDrag: 弹窗拖拽+水平方向伸缩

const toDialogDrag = Vue.directive("dialogDrag", {
  // bind(el, binding, vnode, oldVnode) {
  //   //弹框可拉伸最小宽高

  //   let minWidth = 400;

  //   let minHeight = 300;

  //   //初始非全屏

  //   let isFullScreen = false;

  //   //当前宽高

  //   let nowWidth = 0;

  //   let nowHight = 0;

  //   //当前顶部高度

  //   let nowMarginTop = 0;

  //   //获取弹框头部（这部分可双击全屏）

  //   const dialogHeaderEl = el.querySelector(".el-dialog__header");

  //   //弹窗

  //   const dragDom = el.querySelector(".el-dialog");

  //   //给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；

  //   dragDom.style.overflow = "auto";

  //   //清除选择头部文字效果

  //   //dialogHeaderEl.onselectstart = new Function("return false");

  //   //头部加上可拖动cursor

  //   dialogHeaderEl.style.cursor = "move";

  //   // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);

  //   const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

  //   let moveDown = e => {
  //     // 鼠标按下，计算当前元素距离可视区的距离

  //     const disX = e.clientX - dialogHeaderEl.offsetLeft;

  //     const disY = e.clientY - dialogHeaderEl.offsetTop;

  //     // 获取到的值带px 正则匹配替换

  //     let styL, styT;

  //     // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px

  //     if (sty.left.includes("%")) {
  //       styL =
  //         +document.body.clientWidth * (+sty.left.replace(/\%/g, "") / 100);

  //       styT =
  //         +document.body.clientHeight * (+sty.top.replace(/\%/g, "") / 100);
  //     } else {
  //       styL = +sty.left.replace(/px/g, "");

  //       styT = +sty.top.replace(/px/g, "");
  //     }

  //     document.onmousemove = function(e) {
  //       // 通过事件委托，计算移动的距离

  //       const l = e.clientX - disX;

  //       const t = e.clientY - disY;

  //       // 移动当前元素

  //       dragDom.style.left = `${l + styL}px`;

  //       dragDom.style.top = `${t + styT}px`;

  //       //将此时的位置传出去

  //       //binding.value({x:e.pageX,y:e.pageY})
  //     };

  //     document.onmouseup = function(e) {
  //       document.onmousemove = null;

  //       document.onmouseup = null;
  //     };
  //   };

  //   dialogHeaderEl.onmousedown = moveDown;

  //   //双击头部全屏效果
  //   let dbclick = () => {

  //       //console.info('binding.value ', binding.value);
  //       if(binding.value && binding.value.fullScreen === false){
  //           return false;
  //       }

  //     if (isFullScreen === false) {
  //       nowHight = dragDom.clientHeight;
  //       nowWidth = dragDom.clientWidth;

  //       nowMarginTop = dragDom.style.marginTop;

  //       dragDom.style.left = 0;

  //       dragDom.style.top = 0;

  //       dragDom.style.height = "100VH";

  //       dragDom.style.width = "100VW";

  //       dragDom.style.marginTop = 0;

  //       isFullScreen = true;

  //       dialogHeaderEl.style.cursor = "initial";

  //       dialogHeaderEl.onmousedown = null;
  //     } else {
  //       dragDom.style.height = "auto";

  //       dragDom.style.width = nowWidth + "px";

  //       dragDom.style.marginTop = nowMarginTop;

  //       isFullScreen = false;

  //       dialogHeaderEl.style.cursor = "move";

  //       dialogHeaderEl.onmousedown = moveDown;
  //     }
  //   };
  //   dialogHeaderEl.ondblclick = dbclick;

  //   dragDom.onmousemove = function(e) {
  //     let moveE = e;

  //     if (
  //       e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 ||
  //       dragDom.offsetLeft + 10 > e.clientX
  //     ) {
  //       dragDom.style.cursor = "w-resize";
  //     } else if (
  //       el.scrollTop + e.clientY >
  //       dragDom.offsetTop + dragDom.clientHeight - 10
  //     ) {
  //       dragDom.style.cursor = "s-resize";
  //     } else {
  //       dragDom.style.cursor = "default";

  //       dragDom.onmousedown = null;
  //     }

  //     dragDom.onmousedown = e => {
  //       const clientX = e.clientX;

  //       const clientY = e.clientY;

  //       let elW = dragDom.clientWidth;

  //       let elH = dragDom.clientHeight;

  //       let EloffsetLeft = dragDom.offsetLeft;

  //       let EloffsetTop = dragDom.offsetTop;

  //       dragDom.style.userSelect = "none";

  //       let ELscrollTop = el.scrollTop;

  //       //判断点击的位置是不是为头部

  //       if (
  //         clientX > EloffsetLeft &&
  //         clientX < EloffsetLeft + elW &&
  //         clientY > EloffsetTop &&
  //         clientY < EloffsetTop + 100
  //       ) {
  //         //如果是头部在此就不做任何动作，以上有绑定dialogHeaderEl.onmousedown = moveDown;
  //       } else {
  //         document.onmousemove = function(e) {
  //           e.preventDefault(); // 移动时禁用默认事件

  //           //左侧鼠标拖拽位置

  //           if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
  //             //往左拖拽

  //             if (clientX > e.clientX) {
  //               dragDom.style.width = elW + (clientX - e.clientX) * 2 + "px";
  //             }

  //             //往右拖拽

  //             if (clientX < e.clientX) {
  //               if (dragDom.clientWidth < minWidth) {
  //               } else {
  //                 dragDom.style.width = elW - (e.clientX - clientX) * 2 + "px";
  //               }
  //             }
  //           }

  //           //右侧鼠标拖拽位置

  //           if (
  //             clientX > EloffsetLeft + elW - 10 &&
  //             clientX < EloffsetLeft + elW
  //           ) {
  //             //往左拖拽

  //             if (clientX > e.clientX) {
  //               if (dragDom.clientWidth < minWidth) {
  //               } else {
  //                 dragDom.style.width = elW - (clientX - e.clientX) * 2 + "px";
  //               }
  //             }

  //             //往右拖拽

  //             if (clientX < e.clientX) {
  //               dragDom.style.width = elW + (e.clientX - clientX) * 2 + "px";
  //             }
  //           }

  //           //底部鼠标拖拽位置

  //           if (
  //             ELscrollTop + clientY > EloffsetTop + elH - 20 &&
  //             ELscrollTop + clientY < EloffsetTop + elH
  //           ) {
  //             //往上拖拽

  //             if (clientY > e.clientY) {
  //               if (dragDom.clientHeight < minHeight) {
  //               } else {
  //                 dragDom.style.height = elH - (clientY - e.clientY) * 2 + "px";
  //               }
  //             }

  //             //往下拖拽

  //             if (clientY < e.clientY) {
  //               dragDom.style.height = elH + (e.clientY - clientY) * 2 + "px";
  //             }
  //           }
  //         };

  //         //拉伸结束

  //         document.onmouseup = function(e) {
  //           document.onmousemove = null;

  //           document.onmouseup = null;
  //         };
  //       }
  //     };
  //   };
  // }
});

//PerfectScrollbar滚动条用于table
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
/**
 * @description 为自定义滚动条全局注入自定义指令。自动判断该更新PerfectScrollbar还是创建它
 * @param {Element} el - 必填。dom元素
 */
const el_scrollBar = el => {
  //在元素上加点私货，名字随便取，确保不会和已有属性重复即可，我取名叫做_ps_
  if (el._gdscroll_ instanceof PerfectScrollbar) {
    el._gdscroll_.update();
  } else {
    //el上挂一份属性
    el._gdscroll_ = new PerfectScrollbar(el, {});
  }
};

Vue.directive("gdScrollBar", {
  inserted(el, binding) {
    const { value } = binding;
    if (value === "el-table") {
      el = el.querySelector(".el-table__body-wrapper");
      if (!el) {
        return console.warn("未发现className为el-table__body-wrapper的dom");
      }
    }
    const rules = ["fixed", "absolute", "relative"];
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(
        `perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join(
          "、"
        )}`
      );
    }
    console.info("gandongScrollBar", value, el);
    setTimeout(() => {
      el_scrollBar(el);
    }, 500);
  },
  componentUpdated(el, binding, vnode) {
    const { value } = binding;
    if (value === "el-table") {
      el = el.querySelector(".el-table__body-wrapper");
      if (!el) {
        return console.warn("未发现className为el-table__body-wrapper的dom");
      }
    }
    vnode.context.$nextTick(() => {
      try {
        el_scrollBar(el);
      } catch (error) {
        console.error(error);
      }
    });
  }
});

//防止多次点击，重复点击延迟2s
const preventReClick = Vue.directive('preventReClick', {
  inserted: function (el, binding) {
      el.addEventListener('click', () => {
          if (!el.disabled) {
              el.disabled = true
              setTimeout(() => {
                  el.disabled = false
              }, binding.value || 2000)
          }
      })
  }
});
const preventReSubmit = Vue.directive('preventReSubmit', {
  inserted: function (el, binding) {
      el.addEventListener('mouseleave', () => {
          if (!el.disabled) {
              el.disabled = true
              setTimeout(() => {
                  el.disabled = false
              }, binding.value || 2000)
          }
      })
  }
});
export default { btnHasPermission, toDialogDrag , preventReClick ,preventReSubmit };
