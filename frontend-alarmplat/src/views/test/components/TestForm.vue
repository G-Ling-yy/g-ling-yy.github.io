<template>
  <ma-form class="test-form" layout="inline" :model="formSearch">
    <ma-form-item>
      <ma-input placeholder="ID" v-model:value="formSearch.id"> </ma-input>
    </ma-form-item>
    <ma-form-item>
      <ma-input placeholder="名称" v-model:value="formSearch.name"> </ma-input>
    </ma-form-item>

    <ma-form-item>
      <ma-button type="primary" html-type="submit" @click="handleSearch">
        查询
      </ma-button>
      <ma-button @click="resetSearch"> 重置 </ma-button>
      <ma-button @click="addTask"> 新增 </ma-button>
      <ma-button @click="toDelByIds" danger> 批量删除 </ma-button>
    </ma-form-item>
  </ma-form>
</template>

<script>
export default {
  name: 'TestForm',
  data() {
    return {
      formSearch: {}
    }
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {},
  methods: {
    changeSearch(formSearch) {
      this.$emit('update:formSearch', formSearch) // 以前是 `this.$emit('input', title)`
    },
    handleSearch() {
      this.changeSearch(this.formSearch)
      this.$emit('handleSearch')
    },
    resetSearch() {
      this.formSearch = {}
      this.changeSearch({})
      this.$emit('resetSearch')
    },
    addTask() {
      this.$emit('addTask')
    },
    toDelByIds() {
      this.$emit('toDelByIds')
    }
  },
  created() {
    this.formSearch = this.search
  }
}
</script>
<style lang="less">
.test-form {
  margin: 20px 0;
  button {
    margin-right: 20px;
  }
}
</style>
