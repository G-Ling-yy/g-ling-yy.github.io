import api from '../api';
import Vue from 'vue';


let v = new Vue();     //新创建一个vue实例

const successCode = 200;

const state = {
    roadFullList                   : [],
    roadFullInfo                   : {},
    roadTotal                      : null,                            // 总页数
    roadPages                      : null,                            // 总页码
    roadPageSize                   : 10,                              // 每页数量
    roadDialogVisible              : false,
};

const actions = {
    /**
     * 获取路线列表
     *
     * @param store
     * @param obj
     * {
          params:{currPage:1,pageSize:10},
          data:{
              "roadCode": "1",		//路线编码（模糊
              "roadName": "",		//路线名称（模糊
              "roadType": "1"		//路线类型
          }
       }
     */
    getRoadListAction(store,obj){
        return api.getRoadList(obj).then((data)=>{
            if(data.code !== successCode){
                v.$message({
                    message: '获取路线列表失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            // // console.log("road=>",data);
            store.commit("setRoadTotal",data.total);
            store.commit("setRoadPages",data.pages);
            store.commit("setRoadFullList",data.data);
        });
    },

    /**
     * 查询单个路线详细信息
     * @param store
     * @param obj
     * { roadId:'' }
     */
    getRoadInfoAction(store,obj) {
        return api.getRoadInfo(obj).then((data)=>{
            if(data.code !== successCode){
                v.$message({
                    message: '获取路线信息失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            // // console.log("road=>",data);
            //store.commit("setRoadInfo",data.data[0]);
            return data;
        });
    },
    /**
     * 添加路线
     * @param store
     * @param obj
        {
          "linkedRegion": [             	//关联城市
            "110000","120000","130000"		//城市编码
          ],
          "roadCode": "hhh",				//路线编码（必填）
          "roadName": "ppp",				//路线名称（必填）
          "roadRegion": "110000",			//省级高速所属省份编码
          "roadType": "1"					//路线类型（必填）
        }
     */
    addRoadInfoAction(store,obj){
        return api.addRoadInfo(obj).then((data)=>{
            if(data.code !== successCode){
                v.$message({
                    message: '添加路线信息失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            return data;
        });
    },

    /**
     * 删除路线
     * @param store
     * @param obj String roadId
     */
    deleteRoadInfoAction(store,obj){
        return api.deleteRoadInfo(obj).then((data)=>{
            if(data.code !== successCode){
                v.$message({
                    message: '删除路线信息失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            return data;
        });
    },
    /**
     * 修改路线
     * @param store
     * @param obj
        {
          "roadId": "",			            //路线id
          "linkedRegion": [             	//关联城市
            "110000","120000","130000"		//城市编码
          ],
          "roadCode": "hhh",				//路线编码（必填）
          "roadName": "ppp",				//路线名称（必填）
          "roadRegion": "110000",			//省级高速所属省份编码
          "roadType": "1"					//路线类型（必填）
        }
     */
    editRoadInfoAction(store,obj){
        return api.editRoadInfo(obj).then((data)=>{
            if(data.code !== successCode){
                v.$message({
                    message: '修改路线信息失败! ['+data.code+']: '+data.message,
                    type: 'error'
                });
                return Promise.reject();
            };
            return data;
        });
    },


};

const mutations = {
    setRoadFullList(state,nv){
        state.roadFullList = nv;
    },
    setRoadTotal(state,nv){
        state.roadTotal = nv;
    },
    setRoadPages(state,nv){
        state.roadPages = nv;
    },
    /*setRoadInfo(state,nv){
        state.roadFullInfo = nv;
    },*/
    setRoadDialogVisible(state,nv){
        state.roadDialogVisible = nv;
    },
};


export default {
    state, mutations,actions
}
