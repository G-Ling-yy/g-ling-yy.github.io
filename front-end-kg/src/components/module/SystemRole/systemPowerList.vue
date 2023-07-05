<template>
  <div class="content-wrapper">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }"
          ><i class="iconfont icondashboard"></i
        ></el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--<div class="search-wrapper">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="审批人">
          <el-input placeholder="审批人" v-model="searchFormData.param1" style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select placeholder="活动区域" style="width: 160px;"  v-model="searchFormData.param2">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="query" @click="currentChange">查询</el-button>
          <el-button type="primary" class="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>-->
    <div class="table-wrapper">
      <div class="table-control">
        <el-button
          type="primary"
          plain
          class="query"
          @click="addPowerClick"
          >新增</el-button
        >
        <!--<el-button type="primary" plain class="query">数据导出</el-button>
        <el-button type="primary" plain class="query">数据导入</el-button>
        <el-dropdown split-button type="primary" >
          批量操作
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
      </div>
      <div class="table-content-body">
        <el-table
          class="custom-cloud-table"
          :data="powerList.powerTreeList"
          row-key="functionCode"
          border
          :tree-props="{ children: 'childNode' }"
        >
          <template slot="empty">
            <loading
              message="暂无数据"
              loading-status="empty"
            ></loading>
          </template>
          <el-table-column
            type="index"
            width="60"
            label="序号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="functionDesc"
            label="权限名称"
            width="260"
          ></el-table-column>
          <el-table-column
            prop="functionCode"
            width="100"
            label="code"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="functionUrl"
            label="权限url"
            width="220"
          ></el-table-column>
          <el-table-column
            prop="showText"
            label="权限描述"
          ></el-table-column>
          <el-table-column
            label="权限类型"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <span
                v-text="
                  scope.row.functionType === '00'
                    ? '菜单'
                    : scope.row.functionType === '10'
                    ? '页面'
                    : '按钮'
                "
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="权限状态"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <i
                class="el-icon-error text-danger"
                style="font-size: 1.6rem;"
                v-if="scope.row.status === '0'"
              ></i>
              <i
                class="el-icon-success text-success"
                style="font-size: 1.6rem;"
                v-else
              ></i>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="70"
          >
            <template slot-scope="scope">
              <el-button
                class="table-control-btn"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="
                  editPowerClick(scope.row, scope.$index)
                "
              ></el-button>
              <!--<el-button class="table-control-btn" type="danger" icon="el-icon-delete" size="mini"></el-button>
              <span class="useroPerate" @click="editPower(scope.row,scope.$index)" v-has-permiss="10933012">编辑</span>
              {{$_btnPermissionCheck('10933012') ? '' : '-'}}-->
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="table-pagination">
        <!--<el-pagination
            :hide-on-single-page="true"
            background
            layout=" prev, pager, next, sizes, jumper "
            :total="1000">
        </el-pagination>-->
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="powerDialogVisible"
      width="30%"
      custom-class="gd-custom-dialog"
      v-dialogDrag
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          ref="addFormDom"
          :model="powerForm"
          label-width="80px"
        >
          <el-form-item
            label="权限名称"
            prop="functionName"
          >
            <el-input
              v-model="powerForm.functionName"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="上级权限"
            prop="parentCodeRs"
          >
            <el-cascader
              :options="powerList.powerTreeList"
              :show-all-levels="true"
              v-model="powerForm.parentCodeRs"
              style="width: 100%;"
              :props="{
                children: 'childNode',
                label: 'functionDesc',
                value: 'functionCode',
                checkStrictly: true,
                expandTrigger: 'hover'
              }"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="权限类型"
            prop="functionType"
            size="small"
          >
            <el-radio-group
              v-model="powerForm.functionType"
            >
              <el-radio-button label="00"
                >菜单</el-radio-button
              >
              <el-radio-button label="10"
                >页面</el-radio-button
              >
              <el-radio-button label="20"
                >按钮</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="访问地址" prop="functionUrl">
            <el-input v-model="powerForm.path"></el-input>
          </el-form-item>
          <el-form-item label="权限状态" prop="status">
            <el-radio-group v-model="powerForm.status">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" prop="functionDesc">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="powerForm.functionDesc"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="powerDialogVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click.native="addPowerSubmit"
          :loading="addLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import loading from '../../common/Loading'

export default {
  components: {
    loading
  },
  data() {
    return {
      powerDialogVisible: false,
      dialogTitle: '',
      tableData: [],
      addLoading: false,
      searchFormData: {
        param1: '',
        param2: ''
      },
      powerForm: {
        functionName: '',
        parentCodeRs: ['1093'],
        parentCode: '1093',
        path: '',
        functionDesc: '',
        functionType: '10',
        status: '1'
      }
    }
  },
  computed: {
    ...mapState(['powerList'])
  },
  mounted() {
    this.getPowerList()
  },

  /*beforeRouteLeave(to,from,next){
      //this.setPowerTableList([]);
      //next();
    },*/
  methods: {
    ...mapActions([
      'getPowerList',
      'editPowerList',
      'addPower'
    ]),

    ...mapMutations([
      'setPowerTableList',
      'setPowerRawTableList',
      'setPowerEditFormVisible',
      'setPowerEventList',
      'setPowerEvenIndex',
      'setPowerSelectTreeList',
      'setPowerSelectedName',
      'setPowerAddParentCode'
    ]),
    /**
     * 点击页码事件
     * @param index
     */
    currentChange(index) {
      /*this.currentPage=index;
        var data=this.filters;
        data.currPage=index;
        data.pageSize=this.camera.cameraPageSize;
        this.getPowerList(data);*/
      this.getPowerList()
    },
    handleClick(row) {
      console.log(row)
    },
    /**
     * 新增权限
     */
    addPowerClick() {
      this.dialogTitle = '添加权限'
      this.powerDialogVisible = true
      this.$nextTick(() => {
        this.$refs.addFormDom.resetFields()
        this.powerForm = {
          functionName: '',
          parentCodeRs: ['1093'],
          parentCode: '1093',
          path: '',
          functionDesc: '',
          functionType: '10',
          status: '1'
        }
      })
    },
    /**
     * 编辑按钮点击事件
     * @param row
     * @param index
     */
    editPowerClick(row, index) {
      this.dialogTitle = '权限编辑'
      this.powerDialogVisible = true

      const newRow = JSON.parse(JSON.stringify(row))
      newRow.parentCodeRs = row.parentCode
      newRow.parentCode = row.parentCode
      newRow.functionDesc = row.showText
      newRow.functionName = row.functionDesc + ''
      newRow.path = row.path

      this.powerForm = newRow

      console.info(row, this.powerForm)
    },
    /**
     * 新增/编辑权限提交
     */
    addPowerSubmit() {
      this.$refs.addFormDom.validate(valid => {
        if (!valid) {
          return this.$message({
            message: '请核对填写信息',
            type: 'success'
          })
        }

        console.info('编辑权限提交  ', this.powerForm)
        // this.addLoading = true;
        this.powerDialogVisible = false
        /*this.powerForm.functionName=this.powerForm.label;
          this.powerForm.parentCode=this.powerList.powerAddParentCode;
          this.powerForm.functionDesc=this.powerList.showText?this.powerList.showText:this.addGroup.showText;*/
        if (Array.isArray(this.powerForm.parentCodeRs))
          this.powerForm.parentCode = this.powerForm.parentCodeRs[
            this.powerForm.parentCodeRs.length - 1
          ]

        if (this.dialogTitle === '权限编辑') {
          this.editPowerList(this.powerForm).then(res => {
            this.addLoading = false
            console.log(133313, res)
            if (res.code === 200) {
              this.powerDialogVisible = false
              this.getPowerList()
            }
          })
          return
        }
        this.addPower(this.powerForm).then(res => {
          this.addLoading = false
          if (res.code === 200) {
            this.powerDialogVisible = false
            this.getPowerList()
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.table-wrapper {
  min-height: calc(100% - 35px);
}
</style>
