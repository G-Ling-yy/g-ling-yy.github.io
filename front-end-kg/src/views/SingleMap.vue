<template>
  <div class="map-box box-on-top">
    <!--地图容器-->
    <screen-amap
      ref="amapIns"
      @amapComplete="amapCompleteCallback"
      @amap-changed="refreshAmapMarks"
      @amapMarkerClick="amapMarkerClick"
      :base-top-adcodes="regionCode"
      :base-top-adcodes-name="regionName"
    ></screen-amap>
    <!--<emap @emap-complete="amapCompleteCallback"></emap>-->

    <!--地图工具按钮-->
    <div class="camera-type-panel" style="left: 20px;">
      <!--<div class="map-back-btn" v-if="currCategoryPathIndex > 0" @click="gobackRoute">返回{{prevCategoryCode[2].name
          || '全国'}}
      </div>-->
      <div class="btn-wrap" :class="cameraStatusCollapsed ? 'status-collapsed' : ''">
        <div
          class="ol-btn"
          :class="cameraStatusChange.indexOf('1') >= 0  ? 'active' : ''"
          @click="cameraStatusSelectClick('1')"
        ></div>
        <div
          class="fl-btn animated"
          :class="cameraStatusChange.indexOf('0') >= 0  ? 'active' : ''"
          @click="cameraStatusSelectClick('0')"
        ></div>
        <div
          class="ero-btn animated"
          :class="cameraStatusChange.indexOf('2') >= 0  ? 'active' : ''"
          @click="cameraStatusSelectClick('2')"
        ></div>
        <div class="collapse-btn" @click="cameraStatusCollapseClick"></div>
      </div>

      <div class="btn-wrap">
        <!--'1','2','3','7','5','6'-->
        <div
          class="dlyx-btn"
          :class="cameraTypeSelect.indexOf('1') >= 0  ? 'active' : ''"
          @click="cameraTypeSelectClick('1')"
        ></div>
        <div
          class="mj-btn"
          :class="cameraTypeSelect.indexOf('2') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('2')"
        ></div>
        <div
          class="qd-btn"
          :class="cameraTypeSelect.indexOf('3') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('3')"
        ></div>
        
        <div
          class="etc-btn"
          :class="cameraTypeSelect.indexOf('7') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('7')"
        ></div>
        <div
          class="sfz-btn"
          :class="cameraTypeSelect.indexOf('5') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('5')"
        ></div>
        <div
          class="fwq-btn"
          :class="cameraTypeSelect.indexOf('6') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('6')"
        ></div>
        <div
          class="qt-btn"
          :class="cameraTypeSelect.indexOf('4') >= 0 ? 'active' : ''"
          @click="cameraTypeSelectClick('4')"
        ></div>
        <div class="last-item"></div>
      </div>
    </div>

    <div class="map-layer-wrap" style="right: 20px;">
      <div class="base-layer-btn" v-if="mapLayerType==='google'" @click="checkMapType('base')">
        <span>地图</span>
      </div>
      <div class="google-layer-btn" v-if="mapLayerType==='base'" @click="checkMapType('google')">
        <span>卫星</span>
      </div>
    </div>
  </div>
</template>


<script type="text/javascript" src="./js/single-map.js"></script>
<style lang="less" src="./css/traffic-map.less"></style>
