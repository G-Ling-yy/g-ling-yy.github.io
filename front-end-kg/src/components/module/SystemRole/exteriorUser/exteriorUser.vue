<template>
    <div class="exteror">
       <!-- 头部区域 -->
        <div class="headed">
            <div>
                <el-button
                    type="primary"
                    plain
                    class="query"
                    @click="increaseOrganization()"
                    >添加机构</el-button
                  >
                  <el-button
                    type="primary"
                    plain
                    class="query"
                    @click="increaseUserOrganization()"
                    >添加用户</el-button
                  >
            </div>
            <div>
                <el-input
                    v-model="externalOrganizationName"
                    placeholder="请输入机构名称"
                    style="width: 200px;"
                  ></el-input>
                  <el-button 
                    type="primary" 
                    class="query"
                    @click="queryExternalOrganization()"
                    >搜索</el-button>
                  <el-button 
                    type="primary" 
                    class="reset"
                    @click="resetExternalOrganization()" 
                    >重置</el-button>
                  <el-button 
                    type="info" 
                    class="reset" 
                    @click="batchDelExternalOrganization()"
                    >批量删除</el-button>
            </div>
        </div>
        <!-- 内容区域 -->
        <div class="main">
            <el-table
                ref="exteror"
                :data="externalTableData"
                highlight-current-row
                style="width: 100%"
                border
                @selection-change="handleSelectionChange"
                >
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                    prop="externalOrganizationName"
                    label="机构名称"
                    width="200">
                </el-table-column>
                <el-table-column
                  prop="regionName"
                  label="所属区域"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="detailAddress"
                  label="详细位置"
                  width="260">
                </el-table-column>
                <el-table-column
                  prop="unitType"
                  label="单位类型"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="unitLevel"
                  label="单位级别"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="scale"
                  label="当前规模/人"
                  width="100">
                </el-table-column>
                <el-table-column label="操作" width="240">
                      <template slot-scope="scope">
                        <el-tooltip effect="dark" content="修改" placement="top">
                          <el-button
                            class="table-control-btn"
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="modificationOrganization(scope.row)"
                            ></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="添加用户" placement="top">
                          <el-button
                            class="table-control-add"
                            type="primary"
                            size="mini"
                            @click="editUserOrganization(scope.row)"
                          >
                          </el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="查看详情" placement="top">
                          <el-button
                            class="table-control-btn"
                            type="primary"
                            icon="el-icon-document"
                            size="mini"
                            @click="examineExternalUserDetails(scope.row)"
                          ></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top">
                            <el-button
                                class="table-control-btn"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="deleteExternalOrganization(scope.row)"
                            ></el-button>
                        </el-tooltip>
                      </template>
                    </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="table-pagination">
              	<p class="total-pagination">共{{organizationTotal}}条</p>
                <el-pagination
                    background
                    layout=" prev, pager, next, sizes, jumper "
                    :total="organizationTotal"
                    :page-size="pageSize"
                    :current-page="currPage"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  ></el-pagination>
            </div>
        </div>
        <!-- 添加(修改)机构（对话框） -->
        <el-dialog
            :title="organizationTitle"
            :visible.sync="addExteriorOrganizationVisable"
            v-dialogDrag
            :append-to-body="true"
            :close-on-click-modal="false"
            :before-close="exteriorOrganizationClose"
            width="28%"
            >
        <el-form 
          :model="queryExternaForm" 
          label-width="100px"
          ref="addExternaForm"
          >
            <el-form-item 
                label="行政区域:" 
                prop="administrative"
                :rules="[{ required: true, message: '行政区域不能为空' }]"
            >
                <el-cascader
                  :options="administrativeData"
                  v-model="queryExternaForm.administrative"
                  :props="cascaderAdministrative"
                  clearable
                  :show-all-levels="true"
                ></el-cascader>
          </el-form-item>
          <el-form-item
            label="所属机构:"
            prop="externalOrganizationName"
            :rules="[{ required: true, message: '所属机构不能为空' }]"
          >
            <el-input
              v-model.trim="queryExternaForm.externalOrganizationName"
              placeholder="请输入所属机构"
              clearable
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="单位类型:"
            prop="unitType"
          >
            <el-input
              v-model.trim="queryExternaForm.unitType"
              placeholder="请输入单位类型"
              clearable
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
           <el-form-item
            label="单位级别:"
            prop="unitLevel"
            clearable
          >
            <el-input
              v-model.trim="queryExternaForm.unitLevel"
              placeholder="请输入单位级别"
              clearable
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
           <el-form-item
            label="详细地址:"
            prop="detailAddress"
          >
            <el-input
              v-model.trim="queryExternaForm.detailAddress"
              placeholder="请输入详细地址"
              clearable
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="exteriorOrganizationClose()">取 消</el-button>
          <el-button @click="confirmIncreaseOrganization()" type="primary" >确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加(修改)外部用户（对话框） -->
        <el-dialog
            :title="externalUserTitle"
            :visible.sync="addExteriorUserVisable"
            v-dialogDrag
            :append-to-body="true"
            :close-on-click-modal="false"
            :before-close="exteriorUserClose"
            width="28%"
            >
        <el-form 
          :model="queryExternaUserForm" 
          label-width="100px"
          ref="addExternaUserForm"
          >
            <el-form-item 
                label="所属机构:" 
                prop="externalOrganizationName"
                :rules="[{ required: true, message: '所属机构不能为空' }]"
            >
                <el-cascader
                  :options="organizationOptions"
                  v-model="queryExternaUserForm.externalOrganizationName"
                  :props="cascaderOrganizationProps"
                  clearable
                  :show-all-levels="true"
                ></el-cascader>
          </el-form-item>
          <el-form-item
            label="用户姓名:"
            prop="userName"
            :rules="[{ required: true, message: '用户姓名不能为空' }]"
          >
            <el-input
              v-model.trim="queryExternaUserForm.userName"
              placeholder="请输入用户姓名"
              clearable
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系方式:"
            prop="userPhone"
            :rules="[{pattern:/^1[3456789]\d{9}$/,message:'请输入正确的手机号', trigger: 'blur'}]"
          >
            <el-input
              v-model="queryExternaUserForm.userPhone"
              placeholder="请输入联系方式"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="exteriorUserClose()">取 消</el-button>
          <el-button @click="confirmIncreaseUserOrganization()" type="primary" >确 定</el-button>
        </div>
      </el-dialog>
      <!-- 查看详情 -->
      <el-dialog 
        title="用户详情" 
        :visible.sync="examineDetailsVisible" 
        v-dialogDrag
        :append-to-body="true"
        :close-on-click-modal="false"
        :before-close="examineDetailsClose"
        >
            <el-table 
              :data="externalUserTableData"
              max-height="500" 
              border>
               <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="60"
                ></el-table-column>
                 <el-table-column
                    prop="externalUserName"
                    label="用户姓名"
                    width="120">
                </el-table-column>
                <el-table-column
                  prop="phone"
                  label="联系方式"
                  width="120">
                </el-table-column>
                <el-table-column 
                  prop="gmtCreate" 
                  label="添加时间" 
                  width='180'>
                  </el-table-column>
                  <el-table-column label="操作" width>
                      <template slot-scope="scope">
                        <el-tooltip effect="dark" content="修改" placement="top">
                          <el-button
                            class="table-control-btn"
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="modificationUserOrganization(scope.row)"
                            ></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top">
                            <el-button
                                class="table-control-btn"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="deleteExternalUserOrganization(scope.row)"
                            ></el-button>
                        </el-tooltip>
                      </template>
                    </el-table-column>
            </el-table>
            <!--分页控件-->
            <div class="table-pagination">
	              <p class="total-pagination">共{{userTotal}}条</p>
                <el-pagination
                  background
                  layout=" prev, pager, next, sizes, jumper "
                  @current-change="userPageChange"
                  @size-change="userSizeChange"
                  :current-page="userCurrPage"
                  :page-size="userPageSize"
                  :total="userTotal"
                ></el-pagination>
            </div>
        </el-dialog>
        <!-- 删除机构（用户）对话框 -->
        <el-dialog
          title="删除提示"
          :visible.sync="deleteDataVisible"
          v-dialogDrag
          :append-to-body="true"
          :close-on-click-modal="false"
          width="30%">
        <span class="span-top">{{deleteVisibleData.spanTop}}</span>
        <span class="span-bottom">{{deleteVisibleData.spanBottom}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDataVisible = false">取 消</el-button>
          <el-button type="primary" @click="delPresentList">确 定</el-button>
        </span>
      </el-dialog>
    </div>  
</template>
<script>
import api from "@/api";
export default {
    data() {
        return {
            externalTableData: [], //外部机构数据
            currPage: 1,
            pageSize: 10,
            organizationTotal: 0,
            externalOrganizationName: null, //查询机构关键字
            administrativeData: [], // 行政区域菜单选项
            cascaderAdministrative: { // 行政区域菜单选项配置项
              value: "regionCode",
              label: "regionName",
              children: "childList",
              checkStrictly: true,
              multiple: false,
            },
            organizationOptions: [],// 所属机构菜单选项
            cascaderOrganizationProps: {
              value: "id",
              label: "externalOrganizationName",
              children: "childList",
              checkStrictly: true,
              multiple: false,
            },
            queryExternaForm: {
              administrative: null, // 行政区域
              externalOrganizationName: null, // 所属机构
              unitType: null, // 单位类型
              unitLevel: null, // 单位级别
              detailAddress: null, // 详细地址
            },
            queryExternaUserForm: {
              externalOrganizationName: null, // 所属机构
              userName: null, // 用户姓名
              userPhone: null, // 联系方式
            },
            organizationTitle: null,//添加或修改机构title
            organizationType: null, //添加或修改机构类型
            externalUserTitle: null,//添加或修改外部用户title
            externalUserType: null, //添加或修改外部用户类型
            addExteriorOrganizationVisable: false, //添加机构
            addExteriorUserVisable: false, //添加外部用户
            examineDetailsVisible: false, // 用户详情
            externalUserTableData: [], //外部用户数据
            userCurrPage: 1,
            userPageSize: 10,
            userTotal: 0,
            deleteDataVisible: false, // 删除提示对话框
            deleteVisibleType: null, // 删除提示类型
            deleteVisibleRowId: null,
            deleteVisibleData: {
              spanTop: null,
              spanBottom: null
            },
            externalOrganizationId: null,//外部机构id
            externalUserOrganizationId: null,//外部用户id
            multipleSelection: [], // 表格选中的数据
        }
    },
    created() {
       this.getExternalOrganizationList() 
       this.getAdministrativeList() // 获取行政区域
    },
    methods: {
        // 获取机构表格数据
        getExternalOrganizationList() {
           let params = {
               pageSize	: this.pageSize,
               currPage: this.currPage,
               externalOrganizationName: this.externalOrganizationName,
           } 
           api.getExternalOrganizationList(params).then((res)=>{
               if(res.code === 200) {
                   console.log('参数',res.data)
                   this.externalTableData = res.data
                   this.organizationTotal = res.total
               }
           })
        },
        inpuu () {
          console.log('所属机构', this.queryExternaForm.externalOrganizationName)
        },
        // 查询机构组织
        queryExternalOrganization() {
            this.currPage = 1
            this.getExternalOrganizationList()
        },
        // 重置机构组织
        resetExternalOrganization() {
            this.currPage = 1
            this.externalOrganizationName = ''
            this.getExternalOrganizationList()
        },
         // 获取外部用户表格数据
        getExternalUserList() {
           let params = {
               pageSize	: this.userPageSize,
               currPage:  this.userCurrPage,
               externalOrganizationId: this.externalOrganizationId,
           } 
           api.getExternalUserList(params).then((res)=>{
               if(res.code === 200) {
                   console.log('参数wai',res.data)
                   this.externalUserTableData = res.data
                   this.userTotal = res.total
               }
           })
        },
        // 获取行政区域
        getAdministrativeList() {
          let params = {
            parentRegionCode: JSON.parse(localStorage.getItem("cloudplatform")).regionCode,
            regionLevel: 2
          }
          api.getRegion(params).then(res=>{
            if(res.code === 200) {
              console.log('行政区域',res.data)
              this.administrativeData = res.data
            }
          })
        },
          // 获取所属机构
        getCascaderOrganizationList() {
          let params = {
              pageSize : 0,
              currPage : 0,
          }
          api.getExternalOrganizationList(params).then(res=>{
            if(res.code === 200) {
              console.log('所属机构',res.data)
              this.organizationOptions = res.data
            }
          })
        },
        // 添加机构
        increaseOrganization () {
            this.organizationTitle = '添加机构'
            this.organizationType = 'add'
            this.addExteriorOrganizationVisable = true
        },
        // 修改机构
        modificationOrganization (row) {
          console.log(row)
          this.organizationTitle = '修改机构'
          this.organizationType = 'modification'
          this.externalOrganizationId = row.id // 外部用户id
          this.queryExternaForm.administrative = [`${row.regionCode}`]
          this.queryExternaForm.externalOrganizationName = row.externalOrganizationName
          this.queryExternaForm.unitType = row.unitType
          this.queryExternaForm.unitLevel = row.unitLevel
          this.queryExternaForm.detailAddress = row.detailAddress
          this.addExteriorOrganizationVisable = true
        },
        // 添加机构弹窗确定事件
        confirmIncreaseOrganization () {
          this.$refs.addExternaForm.validate().then(res => {
              if(this.organizationType === 'add') {
                let params = {
                  detailAddress: this.queryExternaForm.detailAddress, // 详细地址
                  externalOrganizationName : this.queryExternaForm.externalOrganizationName, // 外部机构名称
                  regionCode : this.queryExternaForm.administrative ? this.queryExternaForm.administrative[this.queryExternaForm.administrative.length - 1] : null, // 区域编码 
                  unitLevel : this.queryExternaForm.unitLevel, // 单位级别
                  unitType: this.queryExternaForm.unitType, // 单位类型
                }
                console.log('确定保存',this.queryExternaForm, params)
                api.addExternaOrganization(params).then(res=>{
                  if(res.code === 200) {
                    console.log('成功',res.data)
                    this.$message({
                      message:'新增成功！',
                      type: 'success'
                    })
                     this.exteriorOrganizationClose()
                     this.getExternalOrganizationList()
                  } else {
                    this.$message({
                      message: res.message,
                      type: 'error'
                    })
                  }
                })
              } else if (this.organizationType === 'modification') {
                let params = {
                  id: this.externalOrganizationId,
                  data: {
                    detailAddress: this.queryExternaForm.detailAddress, // 详细地址
                    externalOrganizationName : this.queryExternaForm.externalOrganizationName, // 外部机构名称
                    regionCode : this.queryExternaForm.administrative ? this.queryExternaForm.administrative[this.queryExternaForm.administrative.length - 1] : null, // 区域编码 
                    unitLevel : this.queryExternaForm.unitLevel, // 单位级别
                    unitType: this.queryExternaForm.unitType, // 单位类型
                  }
                }
                api.updateExternalOrganization(params).then(res=>{
                  if(res.code === 200) {
                    console.log('修改成功',res.data)
                    this.$message({
                      message:'修改成功！',
                      type: 'success'
                    })
                     this.exteriorOrganizationClose()
                     this.getExternalOrganizationList()
                  } else {
                    this.$message({
                      message: res.message,
                      type: 'error'
                    })
                  }
                })
              }
          })
        },
        // 添加机构关闭弹窗回调
        exteriorOrganizationClose () {
          console.log('添加机构Close')
          this.addExteriorOrganizationVisable = false
          this.queryExternaForm.administrative = null
          this.queryExternaForm.externalOrganizationName = null
          this.queryExternaForm.unitType = null
          this.queryExternaForm.unitLevel = null
          this.queryExternaForm.detailAddress = null
        },
        // 添加外部用户
        increaseUserOrganization () {
          this.externalUserTitle = '添加外部用户'
          this.externalUserType = 'add'
          this.getCascaderOrganizationList() // 获取所属机构
          this.addExteriorUserVisable = true
        },
        // 编辑添加外部用户
        editUserOrganization (row) {
          console.log(row)
          this.externalUserTitle = '添加外部用户'
          this.externalUserType = 'add'
          this.queryExternaUserForm.externalOrganizationName = [`${row.id}`]
          this.getCascaderOrganizationList() // 获取所属机构
          this.addExteriorUserVisable = true
        },
        // 修改外部用户
        modificationUserOrganization (row) {
          console.log(row)
          this.externalUserTitle = '修改外部用户'
          this.externalUserType = 'modification'
          this.externalUserOrganizationId = row.id
          this.queryExternaUserForm.externalOrganizationName = [`${row.externalOrganizationId}`]
          this.queryExternaUserForm.userName = row.externalUserName
          this.queryExternaUserForm.userPhone = row.phone
          this.getCascaderOrganizationList() // 获取所属机构
          this.addExteriorUserVisable = true
        },
        // 添加外部用户弹窗确定事件
        confirmIncreaseUserOrganization () {
          this.$refs.addExternaUserForm.validate().then(res => {
            if(this.externalUserType === 'add') {
              let params = {
                externalOrganizationId : this.queryExternaUserForm.externalOrganizationName ? this.queryExternaUserForm.externalOrganizationName[this.queryExternaUserForm.externalOrganizationName.length - 1] : null, // 组织机构Id 
                externalUserName : this.queryExternaUserForm.userName, // 用户姓名
                phone : this.queryExternaUserForm.userPhone, // 手机号
              }
              console.log('确定保存用户',this.queryExternaUserForm,params)
              api.createExternalUser(params).then(res=>{
                if(res.code === 200) {
                  console.log('成功',res.data)
                  this.$message({
                    message:'新增用户成功！',
                    type: 'success'
                  })
                  this.exteriorUserClose()
                  this.getExternalOrganizationList()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'error'
                  })
                 }
              })
            } else if(this.externalUserType === 'modification') {
              let params = {
                id: this.externalUserOrganizationId,
                data: {
                  externalOrganizationId : this.queryExternaUserForm.externalOrganizationName ? this.queryExternaUserForm.externalOrganizationName[this.queryExternaUserForm.externalOrganizationName.length - 1] : null, // 组织机构Id 
                  externalUserName : this.queryExternaUserForm.userName, // 用户姓名
                  phone : this.queryExternaUserForm.userPhone, // 手机号
                }
              }
              api.updateExternalUser(params).then(res=>{
                if(res.code === 200) {
                  console.log('成功',res.data)
                  this.$message({
                    message:'修改用户成功！',
                    type: 'success'
                  })
                  this.exteriorUserClose()
                  this.getExternalUserList()
                  this.getExternalOrganizationList()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'error'
                  })
                }
              })
            }
          })
        },
        // 添加用户关闭弹窗回调
        exteriorUserClose () {
          console.log('添加用户Close')
          this.addExteriorUserVisable = false
          this.queryExternaUserForm.externalOrganizationName = null
          this.queryExternaUserForm.userName = null
          this.queryExternaUserForm.userPhone = null

        },
        // 外部机构表格查看详情
        examineExternalUserDetails(row) {
            this.externalOrganizationId = row.id
            this.getExternalUserList()
            this.examineDetailsVisible = true
        },
          // 机构表格查看详情关闭弹窗回调
        examineDetailsClose () {
          console.log('机构表格查看详情Close')
          this.examineDetailsVisible = false
          this.userCurrPage = 1
        },
        // 删除机构
        deleteExternalOrganization(row) {
          console.log('删除机构',row)
          let ids = []
          ids.push(row.id)
          this.deleteVisibleRowId = ids
          this.deleteVisibleType = 'organization'
          this.deleteVisibleData.spanTop = '删除机构将同时删除该机构下所有用户，确定删除该机构？'
          this.deleteVisibleData.spanBottom = '删除操作不可恢复！'
          this.deleteDataVisible = true
        },
        // 批量删除机构
        batchDelExternalOrganization () {
          console.log('删除机构',this.multipleSelection)
          if(this.multipleSelection.length) {
            let ids = []
            this.multipleSelection.map(it=>{
              ids.push(it.id)
            })
            this.deleteVisibleRowId = ids
            this.deleteVisibleType = 'organization'
            this.deleteVisibleData.spanTop = '删除机构将同时删除该机构下所有用户，确定删除该机构？'
            this.deleteVisibleData.spanBottom = '删除操作不可恢复！'
            this.deleteDataVisible = true
          } else {
            this.$message({
              message: '请勾择您要删除的数据',
              type: 'warning'
            })
          }
        },
        // 删除用户
        deleteExternalUserOrganization(row) {
          console.log('删除用户',row)
          let ids = []
          ids.push(row.id)
          this.deleteVisibleRowId = ids
          this.deleteVisibleType = 'user'
          this.deleteVisibleData.spanTop = '确定删除该用户吗？'
          this.deleteVisibleData.spanBottom = '删除操作不可恢复！'
          this.deleteDataVisible = true
        },
        // 删除事件
        delPresentList() {
          if (this.deleteVisibleType === 'organization') {
            let params = this.deleteVisibleRowId
            console.log('数组',this.deleteVisibleRowId)
            api.deleteExternaOrganization(params).then(res=>{
              if(res.code === 200){
                this.$message({
                  message: '删除成功！',
                  type: 'success'
                })
                this.deleteDataVisible = false
                this.getExternalOrganizationList() 
              }
            })
          } else if (this.deleteVisibleType === 'user') {
            let params = this.deleteVisibleRowId
            console.log('yonghu',params)
             api.deleteExternalUser(params).then(res=>{
              if(res.code === 200){
                this.$message({
                  message: '删除成功！',
                  type: 'success'
                })
                this.deleteDataVisible = false
                this.getExternalUserList()
                this.getExternalOrganizationList()
              }
            })
          }
        },
        // table表格多选选择的数据
        handleSelectionChange (val) {
          this.multipleSelection = val
        },
        // 分页处理
        handleSizeChange(sizeVal) {
          this.pageSize = sizeVal;
          this.getExternalOrganizationList() 
        },
        handleCurrentChange(curPage) {
          this.currPage = curPage;
          this.getExternalOrganizationList() 
        },
        // 用户分页处理
        userSizeChange(sizeVal) {
          this.userPageSize = sizeVal;
          this.getExternalUserList()
        },
        userPageChange(curPage) {
          this.userCurrPage = curPage;
          this.getExternalUserList()
        },
    },
}
</script>
<style lang="less" scoped>
    .exteror {
        // 头部
        .headed {
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 0 20px;
          // background-color: pink;
        }
        // 主体区域
        .main {
            width: 100%;
            padding: 20px 10px;
        }
        .page {
            margin-top: 10px;
        }
    }
    .table-control-add {
        display: inline-block;
        width: 42px;
        height: 30px;
        background-image: url('../../../../assets/images/icon/addUser.png');
        background-repeat:no-repeat;
        background-size: 24px;
        background-position: center;
    
    }
    .span-top {
      display: block;
      padding-left: 30px;
    }
    .span-bottom {
      display: block;
      color: #AAAAAA;
      padding-left: 30px;
      margin-top: 5px;
    }
</style>