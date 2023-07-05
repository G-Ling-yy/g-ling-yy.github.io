import api from "../api";
import Vue from "vue";

let v = new Vue(); //新创建一个vue实例

const state = {
  powerTreeList: [], // 组织树数据
  powerRawTableList: [], // 表格原数据
  powerTableList: [], // 表格数据
  powerEditFormVisible: false, // 控制新增/编辑弹窗可见
  powerEventList: {}, // 编辑选中的行信息
  powerEvenIndex: null, // 编辑选中的index
  powerSelectTreeList: [], // 下拉tree数据
  powerAddParentCode: null, // 新增/编辑ParentCode
  powerSelectedName: "", // 选择父权限列表节点name
};

const actions = {
  /**
   * 获取权限列表
   * @param store
   * @param obj
   */
  getPowerList(store, obj) {
    api.getPowerList().then((data) => {
      // console.log(data, "权限列表");
      if (data.code != 200) {
        v.$message({
          message: "获取权限列表失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }

      store.commit("setPowerTreeList", data.data);
      store.commit("setPowerTableList", data.data);
      //修改后台返回的树结构
      /*let list=[];
            list=JSON.parse(JSON.stringify(data.data).replace(/childNode/g, 'children'));
            list=JSON.parse(JSON.stringify(list).replace(/functionDesc/g, 'label'));
            list=JSON.parse(JSON.stringify(list).replace(/functionCode/g, 'id'));
            let newList=v.Utils.reviseTreeData(list);
            store.commit("setPowerTreeList",newList);
            store.commit("setPowerTableList",newList);

            //console.info("setPowerTreeList    ",list, newList);

            if(store.state.powerRawTableList.children){
                var newTableData=v.Utils.selectTreeData(newList,store.state.powerRawTableList.id);
                //console.log(newTableData);
                if(newTableData[0].functionType==10){
                    var newTableData1=v.Utils.transfer(newTableData,"childrenNode");
                }else{
                    var newTableData1=v.Utils.transfer(newTableData,"children");
                }
                store.commit("setPowerTableList",newTableData1);
            }*/
    });
  },

  /**
   * 修改用户权限
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  editPowerList(store, obj) {
    var info = JSON.parse(JSON.stringify(obj));
    /* info.functionCode=info.id;

        delete info.createDate;
        delete info.parentName;
        delete info.createUser;
        delete info.id;
        delete info.label;
        delete info.modelId;
        delete info.showText;
        delete info.subId;
        delete info.sysId;

        if(info.children){
            delete info.children;
        }else{
            delete info.childrenNode;
        };*/
    return api.editPower(info).then((data) => {
      if (data.code !== 200) {
        v.$message({
          message: "权限修改成功! ",
          // message: "修改权限成功! [" + data.code + "]: " + data.message,
          type: "success",
        });
        return Promise.reject();
      }
      store.commit("setPowerEventList", obj);

      var newTableList = store.state.powerTableList;
      obj.functionUrl = obj.path;
      newTableList[store.state.powerEvenIndex] = obj;
      store.commit("setPowerTableList", newTableList);

      var newRawList = store.state.powerRawTableList;
      if (newRawList.children) {
        newRawList.children = newTableList;
      } else {
        newRawList.childrenNode = newTableList;
      }
      store.commit("setPowerRawTableList", newRawList);

      store.commit("setPowerEditFormVisible", false);
      v.$message({
        message: "修改权限成功",
        type: "success",
      });
      return data;
    });
  },

  /**
   * 新增用户权限
   * @param store
   * @param obj
   * @returns {Promise<*>}
   */
  addPower(store, obj) {
    return api.addPower(obj).then((data) => {
      if (data.code !== 200) {
        v.$message({
          message: "新增权限失败! [" + data.code + "]: " + data.message,
          type: "error",
        });
        return Promise.reject();
      }

      store.dispatch("getPowerList", "");
      store.commit("setPowerEditFormVisible", false);

      v.$message({
        message: "新增权限成功",
        type: "success",
      });
      return data;
    });
  },
};

const mutations = {
  setPowerTreeList(state, nv) {
    state.powerTreeList = nv;
  },
  setPowerRawTableList(state, nv) {
    state.powerRawTableList = nv;
  },
  setPowerTableList(state, nv) {
    state.powerTableList = nv;
  },
  setPowerEditFormVisible(state, nv) {
    state.powerEditFormVisible = nv;
  },
  setPowerEventList(state, nv) {
    state.powerEventList = nv;
  },
  setPowerEvenIndex(state, nv) {
    state.powerEvenIndex = nv;
  },
  setPowerSelectTreeList(state, nv) {
    state.powerSelectTreeList = nv;
  },
  setPowerAddParentCode(state, nv) {
    state.powerAddParentCode = nv;
  },
  setPowerSelectedName(state, nv) {
    state.powerSelectedName = nv;
  },
};

export default {
  state,
  mutations,
  actions,
};
