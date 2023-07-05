<template>
  <div class="map-icon" v-show="iconImg ? true : false" :style="{ width: iconWidth, height: iconHeight }">
    <img :src="iconImg" @click="onIconClick" @mouseover="onIconMouseOver" @mouseout="onIconMouseOut" />
    <!--<span v-show="toolTipVisible" :style="{top: toolTipY,left: toolTipX}">{{ iconName }}</span>-->
  </div>
</template>

<script>
import { createApp } from 'vue'
import { getCurrentInstance, onBeforeMount } from 'vue'
export default {
  /**
   * @description     海量点图层
   * @author          刘晖(liuh@microvideo.cn)
   * @time            2021/11/15 13:10
   */
  setup(props, context) {
    const { ctx } = getCurrentInstance()
    // console.log(ctx, 'ctx ctx ctx ctx ')
  },
  props: {
    iconConfig: null
  },
  name: 'MMapIcon',
  data() {
    return {
      map: null,
      defaultIconConfig: null,
      isChecked: false,
      iconWidth: '2.5vw',
      iconHeight: '5vh',
      iconImg: '',
      iconName: '',
      pointLayer: null,
      pointData: [],
      lineLayer: null,
      lineData: [],
      toolTipX: 0,
      toolTipY: 0,
      toolTipVisible: false
    }
  },
  watch: {
    isChecked() {
      this.setMapIconConfig()
    }
  },
  methods: {
    mapLoad(e) {
      this.map = e
    },

    /**
     * 配置图标type
     */
    setMapIconType() {
      if (this.defaultIconConfig) {
        let type = ''
        if (typeof this.defaultIconConfig == 'object') {
          type = this.defaultIconConfig.type
        } else if (typeof this.defaultIconConfig === 'string') {
          type = this.defaultIconConfig
        }
        let businessConfig = this.$businessIconConfig
        console.log(createApp(), 'defaultIconConfig')
        return
        if (businessConfig.length) {
          businessConfig.map((business, index) => {
            if (type === business.type) {
              this.defaultIconConfig = Object.assign(business, this.defaultIconConfig)
            }
          })
        }

        this.setMapIconConfig()
      }
    },

    /**
     * 配置图标参数
     */
    setMapIconConfig() {
      if (this.defaultIconConfig.img != null && this.defaultIconConfig.img.length === 2) {
        this.iconImg = this.isChecked ? this.defaultIconConfig.img[1] : this.defaultIconConfig.img[0]
        this.iconName = this.defaultIconConfig.name
      }
      if (this.defaultIconConfig.iconWidth) {
        this.iconWidth = this.defaultIconConfig.iconWidth
      }
      if (this.defaultIconConfig.iconHeight) {
        this.iconHeight = this.defaultIconConfig.iconHeight
      }
    },

    /**
     * 图标点击事件
     */
    onIconClick() {
      if (!this.isChecked) {
        this.loadMapLayer()
      } else {
        if (this.pointLayer != null) {
          this.pointLayer.setData([])
        }
        if (this.lineLayer != null) {
          this.lineLayer.map((item, index) => {
            item.hide()
          })
        }
      }
      this.isChecked = !this.isChecked
    },

    /**
     * 图标鼠标移入事件
     */
    onIconMouseOver(e) {
      this.toolTipY = e.offsetY + 'px'
      this.toolTipX = e.offsetX + 'px'
      this.toolTipVisible = true
    },

    /**
     * 图标鼠标移出事件
     */
    onIconMouseOut() {
      this.toolTipVisible = false
    },

    /**
     * 加载图层
     */
    loadMapLayer() {
      if (this.pointLayer != null) {
        return this.pointLayer.setData(this.pointData)
      }
      if (this.lineLayer != null) {
        this.lineLayer.map((item, index) => {
          item.show()
        })
        return
      }

      if (this.defaultIconConfig.queryUrl == null) throw '图层数据源为空'
      const self = this
      this.defaultIconConfig.queryUrl().then(res => {
        let data = res.data
        let result = []
        if (data != null) {
          if (data[0].fvcLon) {
            data.map((item, index) => {
              result.push({
                lnglat: [parseFloat(item.fvcLon), parseFloat(item.fvcLat)],
                name: item.fvcMc,
                id: item.fvcId
              })
            })
          } else if (data[0].trfLon) {
            data.map((item, index) => {
              result.push({
                lnglat: [parseFloat(item.trfLon), parseFloat(item.trfLat)],
                name: item.trfRoadname,
                id: item.trfRoadcode
              })
            })
          } else if (data[0].fvcCentername === '苏通大桥调度中心') {
            let path = []
            data.map((item, index) => {
              path.push([parseFloat(item.lon), parseFloat(item.lat)])
            })
            result.push({
              path: path,
              name: data[0].fvcCentername,
              id: data[0].fvcRoadnum
            })
          } else {
            let path = []
            data.map((item, index) => {
              path.push([parseFloat(item.lon), parseFloat(item.lat)])
            })
            result.push({
              path: path,
              name: data[0].fvcCentername,
              id: data[0].fvcRoadnum
            })
          }
        }
        if (self.defaultIconConfig.model === 'point') {
          self.pointData = JSON.parse(JSON.stringify(result))
          self.pointLayer = self.$mapFunction.createMapMassPointLayer(result, this.defaultIconConfig, e => this.$emit('point-click', e))
        } else {
          self.lineData = result
          self.lineLayer = self.$mapFunction.createMapLineLayer(result, self.defaultIconConfig)
        }
      })
    }
  },
  mounted() {
    // setTimeout(() => {
    this.setMapIconType()
    // }, 10000)
  },
  created() {
    this.defaultIconConfig = this.iconConfig
  }
}
</script>

<style scoped>
.map-icon {
  position: relative;
  z-index: 100;
}

.map-icon img {
  height: 100%;
  width: 100%;
  cursor: pointer;
  z-index: 100;
  object-fit: cover;
}

.map-icon span {
  min-width: 5vh;
  width: auto;
  height: 2vh;
  background: #ffffff;
  font-size: 1.2vh;
  position: absolute;
  text-align: center;
}
</style>
