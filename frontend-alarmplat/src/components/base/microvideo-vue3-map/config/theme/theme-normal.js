/**
 * @description   浅色主题地图相关配置
 * @author       刘晖(liuh@microvideo.cn)
 * @date         2021/11/18 14:32
 */


const normalLayerImgConfig = [
  {
    type: 'lk',
    img: [require('../../static/images/map-layer/normal/img-lk.png'), require('../../static/images/map-layer/normal/img-lk-active.png')],
    color: '#ff0000',
    width: 6,
  }, {
    type: 'sxt',
    img: [require('../../static/images/map-layer/normal/img-sxt.png'), require('../../static/images/map-layer/normal/img-sxt-active.png')],
    icon: [
      { name: 'icon-gs-sxt', url: require('../../static/images/map-icon/dark/gs/icon-sxt.png') },
      { name: 'icon-gs-sxt-active', url: require('../../static/images/map-icon/dark/gs/icon-sxt-active.png') },
      { name: 'icon-gl-sxt', url: require('../../static/images/map-icon/dark/gl/icon-sxt.png') },
      { name: 'icon-gl-sxt-active', url: require('../../static/images/map-icon/dark/gl/icon-sxt-active.png') }
    ],
  }, {
    type: 'qbb',
    img: [require('../../static/images/map-layer/normal/img-qbb.png'), require('../../static/images/map-layer/normal/img-qbb-active.png')],
    icon: [
      { name: 'icon-gs-qbb', url: require('../../static/images/map-icon/dark/gs/icon-qbb.png') },
      { name: 'icon-gs-qbb-active', url: require('../../static/images/map-icon/dark/gs/icon-qbb-active.png') },
      { name: 'icon-gl-qbb', url: require('../../static/images/map-icon/dark/gl/icon-qbb.png') },
      { name: 'icon-gl-qbb-active', url: require('../../static/images/map-icon/dark/gl/icon-qbb-active.png') }
    ],
  }, {
    type: 'jdd',
    img: [require('../../static/images/map-layer/normal/img-jdd.png'), require('../../static/images/map-layer/normal/img-jdd-active.png')],
    icon: [
      { name: 'icon-gs-jdd', url: require('../../static/images/map-icon/dark/gs/icon-jdd.png') },
      { name: 'icon-gs-jdd-active', url: require('../../static/images/map-icon/dark/gs/icon-jdd-active.png') },
      { name: 'icon-gl-jdd', url: require('../../static/images/map-icon/dark/gl/icon-jdd.png') },
      { name: 'icon-gl-jdd-active', url: require('../../static/images/map-icon/dark/gl/icon-jdd-active.png') }
    ],
  }, {
    type: 'dlsj',
    img: [require('../../static/images/map-layer/normal/img-dlsj.png'), require('../../static/images/map-layer/dark/img-dlsj-active.png')],
    icon: [
      { name: 'icon-gs-jdd', url: require('../../static/images/map-icon/dark/gs/icon-jdd.png') },
      { name: 'icon-gs-jdd-active', url: require('../../static/images/map-icon/dark/gs/icon-jdd-active.png') },
      { name: 'icon-gl-jdd', url: require('../../static/images/map-icon/dark/gl/icon-jdd.png') },
      { name: 'icon-gl-jdd-active', url: require('../../static/images/map-icon/dark/gl/icon-jdd-active.png') }
    ],
  }, {
    type: 'jycl',
    img: [require('../../static/images/map-layer/normal/img-jycl.png'), require('../../static/images/map-layer/normal/img-jycl.png')],
    icon: [
      { name: 'icon-gs-jycl', url: require('../../static/images/map-icon/dark/icon-jycl.png') },
      { name: 'icon-gs-jycl-active', url: require('../../static/images/map-icon/dark/icon-jycl.png') },
      { name: 'icon-gl-jycl', url: require('../../static/images/map-icon/dark/icon-jycl.png') },
      { name: 'icon-gl-jycl-active', url: require('../../static/images/map-icon/dark/icon-jycl.png') }
    ],
  }, {
    type: 'jc',
    img: [require('../../static/images/map-layer/normal/img-jc.png'), require('../../static/images/map-layer/normal/img-jc.png')],
    icon: [
      { name: 'icon-gs-jc', url: require('../../static/images/map-icon/dark/icon-jc.png') },
      { name: 'icon-gs-jc-active', url: require('../../static/images/map-icon/dark/icon-jc.png') },
      { name: 'icon-gl-jc', url: require('../../static/images/map-icon/dark/icon-jc.png') },
      { name: 'icon-gl-jc-active', url: require('../../static/images/map-icon/dark/icon-jc.png') }
    ],
  }, {
    type: 'lytc',
    img: [require('../../static/images/map-layer/normal/img-lyyc.png'), require('../../static/images/map-layer/normal/img-lyyc-active.png')],
    icon: [
      { name: 'icon-gs-lytc', url: require('../../static/images/map-icon/dark/gs/icon-jdd.png') },
      { name: 'icon-gs-lytc-active', url: require('../../static/images/map-icon/dark/gs/icon-jdd-active.png') },
      { name: 'icon-gl-lytc', url: require('../../static/images/map-icon/dark/gl/icon-jdd.png') },
      { name: 'icon-gl-lytc-active', url: require('../../static/images/map-icon/dark/gl/icon-jdd-active.png') }
    ],
  }, {
    type: 'zfc',
    img: [require('../../static/images/map-layer/normal/img-zfc.png'), require('../../static/images/map-layer/normal/img-zfc.png')],
    icon: [
      { name: 'icon-gs-jc', url: require('../../static/images/map-icon/dark/icon-zfc.png') },
      { name: 'icon-gs-jc-active', url: require('../../static/images/map-icon/dark/icon-zfc.png') },
      { name: 'icon-gl-jc', url: require('../../static/images/map-icon/dark/icon-zfc.png') },
      { name: 'icon-gl-jc-active', url: require('../../static/images/map-icon/dark/icon-zfc.png') }
    ],
  }, {
    type: 'qxd',
    img: [require('../../static/images/map-layer/normal/img-qxd.png'), require('../../static/images/map-layer/normal/img-qxd-active.png')],
    icon: [
      { name: 'icon-gs-qxd', url: require('../../static/images/map-icon/dark/gs/icon-qxd.png') },
      { name: 'icon-gs-qxd-active', url: require('../../static/images/map-icon/dark/gs/icon-qxd-active.png') },
      { name: 'icon-gl-qxd', url: require('../../static/images/map-icon/dark/gl/icon-qxd.png') },
      { name: 'icon-gl-qxd-active', url: require('../../static/images/map-icon/dark/gl/icon-qxd-active.png') }
    ],
  }, {
    type: 'gq',
    img: [require('../../static/images/map-layer/normal/img-gq.png'), require('../../static/images/map-layer/normal/img-gq-active.png')],
    icon: [
      { name: 'icon-gs-gq', url: require('../../static/images/map-icon/dark/gs/icon-gq.png') },
      { name: 'icon-gs-gq-active', url: require('../../static/images/map-icon/dark/gs/icon-gq-active.png') },
      { name: 'icon-gl-gq', url: require('../../static/images/map-icon/dark/gl/icon-gq.png') },
      { name: 'icon-gl-gq-active', url: require('../../static/images/map-icon/dark/gl/icon-gq-active.png') }
    ],
  }, {
    type: 'fwq',
    img: [require('../../static/images/map-layer/normal/img-fwq.png'), require('../../static/images/map-layer/normal/img-fwq-active.png')],
    icon: [
      { name: 'icon-gs-fwq', url: require('../../static/images/map-icon/dark/gs/icon-fwq.png') },
      { name: 'icon-gs-fwq-active', url: require('../../static/images/map-icon/dark/gs/icon-fwq-active.png') },
      { name: 'icon-gl-fwq', url: require('../../static/images/map-icon/dark/gl/icon-fwq.png') },
      { name: 'icon-gl-fwq-active', url: require('../../static/images/map-icon/dark/gl/icon-fwq-active.png') }
    ],
  }, {
    type: 'sfz',
    img: [require('../../static/images/map-layer/normal/img-sfz.png'), require('../../static/images/map-layer/normal/img-sfz-active.png')],
    icon: [
      { name: 'icon-gs-sfz', url: require('../../static/images/map-icon/dark/gs/icon-sfz.png') },
      { name: 'icon-gs-sfz-active', url: require('../../static/images/map-icon/dark/gs/icon-sfz-active.png') },
      { name: 'icon-gl-sfz', url: require('../../static/images/map-icon/dark/gl/icon-sfz.png') },
      { name: 'icon-gl-sfz-active', url: require('../../static/images/map-icon/dark/gl/icon-sfz-active.png') }
    ],
  }, {
    type: 'qd',
    img: [require('../../static/images/map-layer/normal/img-qd.png'), require('../../static/images/map-layer/normal/img-qd-active.png')],
    icon: [
      { name: 'icon-gs-qd', url: require('../../static/images/map-icon/dark/gs/icon-qd.png') },
      { name: 'icon-gs-qd-active', url: require('../../static/images/map-icon/dark/gs/icon-qd-active.png') },
      { name: 'icon-gl-qd', url: require('../../static/images/map-icon/dark/gl/icon-qd.png') },
      { name: 'icon-gl-qd-active', url: require('../../static/images/map-icon/dark/gl/icon-qd-active.png') }
    ],
  }, {
    type: 'etc',
    img: [require('../../static/images/map-layer/normal/img-etc.png'), require('../../static/images/map-layer/normal/img-etc-active.png')],
    icon: [
      { name: 'icon-gs-etc', url: require('../../static/images/map-icon/dark/gs/icon-etc.png') },
      { name: 'icon-gs-etc-active', url: require('../../static/images/map-icon/dark/gs/icon-etc-active.png') },
      { name: 'icon-gl-etc', url: require('../../static/images/map-icon/dark/gl/icon-etc.png') },
      { name: 'icon-gl-etc-active', url: require('../../static/images/map-icon/dark/gl/icon-etc-active.png') }
    ],
  }, {
    type: 'tcq',
    img: [require('../../static/images/map-layer/normal/img-tcq.png'), require('../../static/images/map-layer/normal/img-tcq-active.png')],
    icon: [
      { name: 'icon-gs-tcq', url: require('../../static/images/map-icon/dark/gs/icon-tcq.png') },
      { name: 'icon-gs-tcq-active', url: require('../../static/images/map-icon/dark/gs/icon-tcq-active.png') },
      { name: 'icon-gl-tcq', url: require('../../static/images/map-icon/dark/gl/icon-tcq.png') },
      { name: 'icon-gl-tcq-active', url: require('../../static/images/map-icon/dark/gl/icon-tcq-active.png') }
    ],
  }, {
    type: 'sn',
    img: [require('../../static/images/map-layer/normal/img-sn.png'), require('../../static/images/map-layer/normal/img-sn-active.png')],
    icon: [
      { name: 'icon-gs-sn', url: require('../../static/images/map-icon/dark/gs/icon-sn.png') },
      { name: 'icon-gs-sn-active', url: require('../../static/images/map-icon/dark/gs/icon-sn-active.png') },
      { name: 'icon-gl-sn', url: require('../../static/images/map-icon/dark/gl/icon-sn.png') },
      { name: 'icon-gl-sn-active', url: require('../../static/images/map-icon/dark/gl/icon-sn-active.png') }
    ],
  }, {
    type: 'ql',
    img: [require('../../static/images/map-layer/normal/img-ql.png'), require('../../static/images/map-layer/normal/img-ql-active.png')],
    icon: [
      { name: 'icon-gs-ql', url: require('../../static/images/map-icon/dark/gs/icon-ql.png') },
      { name: 'icon-gs-ql-active', url: require('../../static/images/map-icon/dark/gs/icon-ql-active.png') },
      { name: 'icon-gl-ql', url: require('../../static/images/map-icon/dark/gl/icon-ql.png') },
      { name: 'icon-gl-ql-active', url: require('../../static/images/map-icon/dark/gl/icon-ql-active.png') }
    ],
  }, {
    type: 'sd',
    img: [require('../../static/images/map-layer/normal/img-sd.png'), require('../../static/images/map-layer/normal/img-sd-active.png')],
    icon: [
      { name: 'icon-gs-sd', url: require('../../static/images/map-icon/dark/gs/icon-sd.png') },
      { name: 'icon-gs-sd-active', url: require('../../static/images/map-icon/dark/gs/icon-sd-active.png') },
      { name: 'icon-gl-sd', url: require('../../static/images/map-icon/dark/gl/icon-sd.png') },
      { name: 'icon-gl-sd-active', url: require('../../static/images/map-icon/dark/gl/icon-sd-active.png') }
    ],
  }, {
    type: 'lx',
    img: [require('../../static/images/map-layer/normal/img-lx.png'), require('../../static/images/map-layer/normal/img-lx-active.png')],
    color: '#b0ff00',
    width: 2,
  }, {
    type: 'zh',
    img: [require('../../static/images/map-layer/normal/img-zh.png'), require('../../static/images/map-layer/normal/img-zh-active.png')],
    icon: [
      { name: 'icon-gs-zh', url: require('../../static/images/map-icon/dark/gs/icon-zh.png') },
      { name: 'icon-gs-zh-active', url: require('../../static/images/map-icon/dark/gs/icon-zh-active.png') },
      { name: 'icon-gl-zh', url: require('../../static/images/map-icon/dark/gl/icon-zh.png') },
      { name: 'icon-gl-zh-active', url: require('../../static/images/map-icon/dark/gl/icon-zh-active.png') }
    ],
  }];

const normalConfig = {
  theme: 'normal',
  mapConfig: {
    mapStyle: 'amap://styles/9cdea5bfec221e6791bb4492c74a0fbd',
  },
  businessConfig: normalLayerImgConfig,
  businessStyleConfig: {
    iconClose: require('../../static/images/map-layer/close-normal.png'),
    background: '#FFFFFF'
  }
};

export { normalConfig };
