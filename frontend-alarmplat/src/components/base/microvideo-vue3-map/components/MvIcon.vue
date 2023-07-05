<template>
  <div
    ref="iconCon"
    :class="iconItem.buttonType === 'custom' ? 'map-icon map-icon-bg' : 'map-icon'"
    :style="iconItem.buttonType === 'custom' ? iconItem.style || `` + ` background-image:url(${!isChecked ? iconItem.icon[0] : iconItem.icon[1]});` : ''"
    @click="onIconClick"
    @mouseover="onIconMouseOver"
    @mouseout="onIconMouseOut"
  >
    <img v-if="iconItem.buttonType !== 'custom'" :src="iconImg" :style="iconItem.style" />
    <div v-show="toolTipVisible" ref="iconTip" :style="`left:calc(-${toolTipX} * .4vh)`">{{ iconItem.title }}</div>
  </div>
</template>

<script>
import { darkConfig } from '../config/theme/theme-dark'
import { normalConfig } from '../config/theme/theme-normal'
export default {
  props: {
    iconConfig: null,
    iconItem: Object,
    mapConfig: Object
  },
  name: 'MvIcon',
  data() {
    return {
      map: null,
      defaultIconConfig: null,
      isChecked: false,
      iconWidth: 'auto',
      iconHeight: '5vh',
      iconImg: '',
      iconName: '',
      pointLayer: null,
      pointData: [],
      lineLayer: null,
      lineData: [],
      toolTipX: 0,
      toolTipY: 0,
      toolTipVisible: false,
      time: null
    }
  },
  watch: {
    isChecked() {
      this.setMapIconConfig()
    },

    mapConfig: {
      handler(newVal) {
        this.defaultIconConfig = this.iconConfig
        this.setMapIconType()
      },
      deep: true
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
        let businessConfig = []
        if (this.$defaultMapConfig.mapStyle === 'amap://styles/9cdea5bfec221e6791bb4492c74a0fbd') {
          businessConfig = normalConfig.businessConfig
        } else {
          businessConfig = darkConfig.businessConfig
        }
        businessConfig.map((business, index) => {
          if (type === business.type) {
            this.defaultIconConfig = Object.assign(business, this.defaultIconConfig)
          }
        })
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
    onIconClick(item) {
      this.isChecked = !this.isChecked
      this.$emit('hanlder', this.iconItem)
      this.$emit('changeChecked', this.isChecked)
    },

    /**
     * 图标鼠标移入事件
     */
    onIconMouseOver(e) {
      this.toolTipVisible = true
      this.toolTipX = this.iconItem.title.length
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
      const self = this
      if (this.pointLayer != null) {
        return this.pointLayer.setData(this.pointData)
      }
      if (this.lineLayer != null) {
        this.lineLayer.map((item, index) => {
          item.show()
        })
        return
      }
    }
  },
  mounted() {},
  created() {
    this.defaultIconConfig = this.iconConfig
    this.setMapIconType()
    if (this.iconConfig.active) {
      this.time = setTimeout(() => {
        this.onIconClick()
      }, 1000)
    }
  },
  destroyed() {
    clearTimeout(this.time)
  }
}
</script>

<style lang="less" scoped></style>
