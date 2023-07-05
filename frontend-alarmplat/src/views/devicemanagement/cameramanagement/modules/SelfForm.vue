<template>
  <ma-form
    class="self-form"
    layout="inline"
    :model="formData"
  >
    <!-- 桩号为空 -->
    <ma-form-item>
      <ma-select
        allowClear
        style="width: 130px"
        v-model:value="formData.isStakeNum"
        placeholder="桩号是否为空"
      >
        <ma-select-option :value="1"> 是 </ma-select-option>
        <ma-select-option :value="0"> 否 </ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 设备状态 -->
    <ma-form-item>
      <ma-select
        allowClear
        style="width: 100px"
        v-model:value="formData.cameraStatus"
        placeholder="设备状态"
      >
        <ma-select-option
          v-for="opt of deviceStatusOpts"
          :key="opt.key"
          :value="opt.value"
          >{{ opt.key }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <!-- 位置类型 -->
    <ma-form-item>
      <ma-select
        v-model:value="formData.locationType"
        allowClear
        :loading="positionTypeLoading"
        placeholder="位置类型"
        style="width: 120px"
      >
        <ma-select-option
          v-for="opt of positionTypeOpts"
          :key="opt.key"
          :value="opt.value"
          >{{ opt.key }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <!-- 归属路线 -->
    <ma-form-item>
      <ma-select
        v-model:value="formData.roadCode"
        allowClear
        :loading="roadLoading"
        placeholder="归属路线"
        style="width: 140px"
      >
        <ma-select-option
          v-for="{ key, value } of roadOpts"
          :key="key"
          :value="value"
          >{{ key }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <!-- 检测状态 -->
    <ma-form-item>
      <ma-select
        allowClear
        style="width: 100px"
        v-model:value="formData.isPoc"
        placeholder="检测状态"
      >
        <ma-select-option :value="2">
          检测中
        </ma-select-option>
        <ma-select-option :value="3">
          未检测
        </ma-select-option>
      </ma-select>
    </ma-form-item>

    <!-- 起始千米桩 -->
    <ma-form-item>
      <ma-input
        allowClear
        placeholder="起始千米桩"
        v-model:value="formData.mileKmStart"
        style="width: 120px"
      >
      </ma-input>
    </ma-form-item>

    <ma-form-item>
      <span>~</span>
    </ma-form-item>

    <!-- 终点千米桩 -->
    <ma-form-item>
      <ma-input
        allowClear
        placeholder="终点千米桩"
        v-model:value="formData.mileKmEnd"
        style="width: 120px"
      >
      </ma-input>
    </ma-form-item>

    <!-- 设备名称 -->
    <ma-form-item>
      <ma-input
        allowClear
        placeholder="设备名称"
        v-model:value="formData.cameraName"
        style="width: 120px"
      >
      </ma-input>
    </ma-form-item>

    <!-- 管辖单位 -->
    <ma-form-item>
      <ma-select
        v-if="userInfo.userSpecificInfo.orgId.length > 1"
        v-model:value="formData.qsId"
        style="width: 100px"
      >
        <ma-select-option
          v-for="opt of userInfo.userSpecificInfo.orgId"
          :key="`opt-${opt.key}`"
          :value="opt.value"
          >{{ opt.key }}</ma-select-option
        >
      </ma-select>
    </ma-form-item>

    <!-- 搜索按钮 -->
    <ma-form-item>
      <ma-button type="primary" @click="$emit('search')">
        搜索
      </ma-button>
    </ma-form-item>

    <!-- 重置按钮 -->
    <ma-form-item>
      <ma-button @click="reset"> 重置 </ma-button>
    </ma-form-item>
  </ma-form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import selfStore from './self-store'

const store = useStore(),
  emits = defineEmits(['search'])

// 用户部分信息
const userInfo = reactive({
  userSpecificInfo: store.getters['user/userSpecificInfo']
})

const formData = computed(() => selfStore.formData),
  // 设备状态选项
  deviceStatusOpts = [
    {
      key: '在线',
      value: 1
    },
    {
      key: '离线',
      value: 2
    },
    {
      key: '未知',
      value: 3
    }
  ],
  // 位置类型loading
  positionTypeLoading = ref(false),
  // 位置类型选项
  positionTypeOpts = computed(
    () => store.state.dataDictionary['location_type'] || []
  ),
  // 归属路线loading
  roadLoading = ref(false),
  // 归属路线选项
  roadOpts = computed(
    () => store.state.constData['belongingRoute'].data || []
  ),
  // 重置
  reset = () => {
    selfStore.initialize()

    // 检测状态默认检测中
    formData.value.isPoc = 2

    // 管辖单位
    formData.value.qsId =
      userInfo.userSpecificInfo.orgId[0]?.value

    emits('search')
  }

onMounted(() => {
  /* 各选项无值取判断 */
  // 位置类型
  positionTypeLoading.value = true
  store
    .dispatch(
      'dataDictionary/checkDicByKey',
      'location_type'
    )
    .finally(() => {
      positionTypeLoading.value = false
    })

  // 归属路线
  roadLoading.value = true
  store
    .dispatch('constData/checkDataByKey', 'belongingRoute')
    .finally(() => {
      roadLoading.value = false
    })

  reset()
})
</script>

<style lang="less" scoped>
.self-form {
  .ant-form-item {
    margin: 0 1rem 1rem 0;
  }
}
</style>
