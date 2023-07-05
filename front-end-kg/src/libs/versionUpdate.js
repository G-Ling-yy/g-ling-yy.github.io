import Vue from 'vue';
import axios from "axios";

const vm = new Vue();
const isNewVersion = () => {
  let url = `//${ window.location.host }/version.json`;
  axios.get(url).then(res => {
    let version = res.data.version;
    let localVersion = localStorage.getItem('version');
    if (localVersion && localVersion != version) {
      if (confirm("系统检测到有新版本，是否更新？")) {
        localStorage.setItem('version', res.data.version);
        window.location.reload();
        return;
      }
    }else {
      localStorage.setItem('version', res.data.version);
    }
  });
};
export default {
  isNewVersion
}