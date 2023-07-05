import api from '../api';


const state = {
    regionId: undefined,
    accessKeyId: undefined,
    accessKeySecret: undefined,
    bucketName: undefined
}

const actions = {

}

const mutations = {
    setRegionId(state,nv){
        state.regionId = nv;
    },
    setAccessKeyId(state,nv){
        state.accessKeyId = nv;
    },
    setAccessKeySecret(state,nv){
        state.accessKeySecret = nv;
    },
    setBucketName(state,nv){
        state.bucketName = nv;
    }
}


export default {
    state, mutations,actions
}