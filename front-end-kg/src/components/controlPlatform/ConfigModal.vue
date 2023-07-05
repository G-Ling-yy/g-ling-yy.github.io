<template>
  <el-dialog
    title="推流配置"
    :visible.sync="visible"
    width="740px"
    custom-class="config-dialog"
    v-dialogDrag
    :append-to-body="true"
    :close-on-click-modal="false"
    destroy-on-close
    @closed="$emit('update:show', false)"
  >
    <h1><i class="el-icon-s-grid" /> 输出分辨率</h1>

    <main>
      <div v-for="(configitem, i) of config" :key="`configitem-${i}`">
        <!-- <div class="checkbox-wrap">
          <el-checkbox
            v-model="config.checked"
            :disabled="config.bitrateId === radioValue"
            >{{
              config.height
                ? `${config.width}*${config.height}`
                : ''
            }}
            {{ config.name }}</el-checkbox
          >
        </div>

            <div class="radio-wrap">
              <el-radio
                v-model="radioValue"
                :label="config.bitrateId"
                @change="radioChangeHandler"
                >默认播放</el-radio
              >
            </div> -->
        <div class="configContent">
          <div class="select-wrap">
            <el-form :inline="true">
              <el-form-item
                label="画质"
                prop="ratio"
                :rules="{
                  message: '请选择画质',
                  required: configitem.checked,
                }"
              >
                <el-select
                  v-model="configitem.bitrateId"
                  :clearable="!configitem.checked"
                  placeholder="请选择流媒体服务"
                  size="small"
                >
                  <el-option
                    v-for="sm of configs"
                    :key="`sm-${sm.id}`"
                    :label="sm.name"
                    :value="sm.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-radio
                  v-model="configitem.radioValue"
                  :label="configitem.radioValue"
                  @change="radioChangeHandler"
                  >默认播放</el-radio
                >
              </el-form-item>
              <el-form-item
                label="流媒体"
                prop="streamId"
                :rules="{
                  message: '请选择对应流媒体',
                  required: configitem.checked,
                }"
                
              >
                <el-select
                  v-model="configitem.streamId"
                  :clearable="!configitem.checked"
                  placeholder="请选择流媒体服务"
                  size="small"
                >
                  <el-option
                    v-for="sm of propsData.streamMediaOpts"
                    :key="`sm-${sm.smId}`"
                    :label="sm.smName"
                    :value="sm.smId"
                  />
                </el-select>
              </el-form-item>
              <i
                @click.prevent="remove()"
                class="el-icon-remove-outline"
                style="line-height: 32px;"
              ></i>
            </el-form>
          </div>
        </div>
      </div>
      <i
        @click.prevent="addConfigList"
        class="el-icon-circle-plus-outline addConfig"
       
      ></i>
      <!-- <div class="configContent">
        <div class="select-wrap">
          <el-form :inline="true">
            <el-form-item
              label="画质"
              prop="ratio"
              :rules="{
                message: '请选择画质',
                required: config.checked,
              }"
            >
              <el-select
                v-model="config.ratio"
                :clearable="!config.checked"
                placeholder="请选择流媒体服务"
              >
                <el-option
                  v-for="sm of configs"
                  :key="`sm-${sm.id}`"
                  :label="sm.name"
                  :value="sm.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-radio
                v-model="radioValue"
                :label="config.bitrateId"
                @change="radioChangeHandler"
                >默认播放</el-radio
              >
            </el-form-item>
            <el-form-item
              label="流媒体"
              prop="streamId"
              :rules="{
                message: '请选择对应流媒体',
                required: config.checked,
              }"
            >
              <el-select
                v-model="config.streamId"
                :clearable="!config.checked"
                placeholder="请选择流媒体服务"
              >
                <el-option
                  v-for="sm of propsData.streamMediaOpts"
                  :key="`sm-${sm.smId}`"
                  :label="sm.smName"
                  :value="sm.smId"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div> -->
    </main>

    <div class="tip">注：同一流媒体支持多种分辨率输出</div>

    <template slot="footer">
      <footer class="flex-center">
        <el-button type="primary" @click="submitHandler">保存</el-button>
        <el-button @click="$emit('update:show', false)">取消</el-button>
      </footer>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    propsData: {
      type: Object,
      default: () => ({}),
    },

    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      configs: [],
      config: [],
      configitem: {
        bitrateId:null,
        radioValue: null,
      },
       streamBitrate:[
         {
          bitrateId: "",
          onDemandStreaming: true,
          streamId: ""
        },
      ],
      // loading: true,
      visible: true,
    };
  },

  methods: {
    radioChangeHandler(v) {
      console.log(v, "vvvv");
      const configitem = this.configs.find((e) => e.bitrateId === v);
      configitem && (configitem.checked = true);
    },
    submitHandler() {
      // Promise.all(
      //   // this.configs.map((e, i) => this.$refs[`elformRef-${i}`][0].validate?.())
      // )
      //   .then(() => {
         
          const streamBitrate = this.config
          console.log(streamBitrate,'streamBitrate')
            // .filter((e) => e.checked)
            // .map((e) => ({
            //   bitrateId: e.bitrateId,
            //   // isDefaultPlay: e.bitrateId === this.radioValue,
            //   // name: e.name,
            //   streamId: e.streamId,
            // }));

          this.$api
            .configureStreamMedia({
              streamBitrate,
              transcodingId: this.propsData.transcodingId,
            })
            .then((res) => {
              if (res.code == 200) {
                this.$message.success("保存成功");
                this.visible = false;
              } else {
                this.$message.warning(res.message || "接口请求失败");
              }
            });
        // })
        // .catch(() => {
        //   this.$message.warning("请先完成对应流媒体的选择");
        // });
    },
    getData() {
      // this.loading = true
      Promise.all([
        this.$api.getBitrateConfig(),
        this.$api.getStreamMediaConfig({
          transcodingId: this.propsData.transcodingId,
        }),
      ])
        .then((res) => {
          this.configs = res[0].data;
          this.config = res[1].data;
          console.log(this.configs, this.config, "this.configs");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //新增配置参数
    addConfigList() {
      this.config.push({
        
      });
    },
    remove(){
       this.config.shift()
    }
  },

  created() {
    window.configModal = this;
    this.getData();
  },
};
</script>

<style lang="less" scoped>
.config-dialog {
  .el-dialog__body {
    & > * {
      user-select: none !important;
    }

    h1 {
      font-size: 18px;

      i {
        color: #409eff;
        margin-right: 5px;
      }
    }

    main {
      min-height: 200px;
      .addConfig {
        float: left;
        padding: 10px;
      }
      ::v-deep .config {
        align-items: center;
        display: flex;
        height: 60px;

        .checkbox-wrap {
          width: 200px;

          .el-checkbox {
            .el-checkbox__input {
              vertical-align: text-bottom;
            }
          }
        }

        .radio-wrap {
          width: 200px;
        }

        .select-wrap {
          width: 300px;

          .el-form {
            .el-form-item {
              &.is-required {
                .el-form-item__label {
                  &::before {
                    color: #f56c6c;
                  }
                }
              }
              margin-bottom: 0;

              .el-form-item__label {
                &::before {
                  color: transparent;
                  content: "*";
                  margin-right: 4px;
                }
                line-height: 40px;
              }
            }
          }
        }
      }
    }

    .tip {
      color: #f93434;
    }
  }
}
</style>
