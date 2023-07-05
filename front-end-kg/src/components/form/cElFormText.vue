<template>
  <div :class="{'is-view-mode':isViewMode}" :style="formStyle" class="auto-form">
    <el-form ref="form" :model="model" :label-width="innerLabelWidth" :label-position="labelPosition"
      :class="{'word-required-type':requiredWordType}" :inline="inline" :label-suffix="labelSuffix"
      :hide-required-asterisk="hideRequiredAsterisk" :show-message="showMessage" :inline-message="inlineMessage"
      :status-icon="statusIcon" :validate-on-rule-change="validateOnRuleChange" :size="size" class="form-type-1"
      @submit.native.prevent>
      <div v-for="(rowt, index) in rows" :key="index" class="form-group-wrap">
        <div v-if="rowt.groupName && groupNameVisible" class="group-name" :class="{[groupNameClass]:true}"
          :data-anchor="rowt.groupName" ref="groupName">{{rowt.groupName}}
        </div>
        <el-row :gutter="16" v-for="(row, index) in rowt.rows" :key="(rowt.groupName || '') + index">
          <el-col :span="item.inerspan" v-for="item in row.cols" :key="item.name"
            :class="{[item.className]:!!item.className, 'changed':showChangeTip && changedItem[item.name]}">
            <template v-if="!item.hidden">
              <el-form-item :label-width="item.labelWidth" v-if="item.vacant">
                <span slot="label">
                  &nbsp;
                </span>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label" v-else-if="isViewMode" :prop="item.name">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                </span>
                <template v-if="item.type !== 'custom'">
                  <span class="value-label">{{viewRender(getLastObj(item.name)[getLastName(item.name)], item)}}</span>
                </template>
                <template v-else>
                  <component :ref="item.name" :is="item.component" :config="item"
                    v-model="getLastObj(item.name)[getLastName(item.name)]" :is-view-mode="true" :parent="parent">
                  </component>

                </template>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label" v-else-if="item.type == 'text'"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                {{model[item.name]}}
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label" v-else-if="item.type == 'input'"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <el-input :ref="item.name" v-model="getLastObj(item.name)[getLastName(item.name)]"
                  :placeholder="item.placeholder" :clearable="item.password?false:item.clearable"
                  :style="{width: getItemWidth(item.width) || innerItemWidth}"
                  :type="(item.password && item.passwordVisible)?'password':'text'" :maxlength="item.maxlength"
                  :disabled="getDisabled(item)" :size="item.size" :show-password="item.showPassword"
                  :suffix-icon="item.suffixIcon" :prefix-icon="item.prefixIcon" :show-word-limit="item.showWordLimit"
                  @change="change(item)">
                  <!-- <div slot="suffix" v-if="item.password" @click="item.passwordVisible = !item.passwordVisible">
                                    <Icon type="md-eye-off" slot="suffix" v-if="item.passwordVisible"/>
                                    <Icon v-else type="md-eye" slot="suffix" />
                                </div> -->
                  <template slot="prepend" v-if="item.prepend">{{item.prepend}}</template>
                  <template slot="append" v-if="item.append">{{item.append}}</template>
                  <template slot="prefix" v-if="item.prefix">{{item.prefix}}</template>
                  <template slot="suffix" v-if="item.suffix">{{item.suffix}}</template>
                </el-input>
              </el-form-item>
              <el-form-item v-else-if="item.type == 'slider'" :label-width="item.labelWidth" :label="item.label"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <el-slider :ref="item.name" v-model="getLastObj(item.name)[getLastName(item.name)]"
                  :style="{width: getItemWidth(item.width) || innerItemWidth}" :disabled="getDisabled(item)"
                  :min="item.min || 0" :max="item.max || 100" :range="item.range" @change="change(item)"></el-slider>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label" v-else-if="item.type == 'date' || item.type == 'datetime' || item.type == 'daterange'
                        || item.type == 'datetimerange' || item.type == 'year'  || item.type == 'month'"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <el-date-picker v-model="getLastObj(item.name)[getLastName(item.name)]" :ref="item.name"
                  :type="item.type" :placeholder="item.placeholder" :clearable="item.clearable"
                  :picker-options="item.options" :style="{width: getItemWidth(item.width) || innerItemWidth}"
                  :disabled="getDisabled(item)" :editable="item.editable" :format="item.format"
                  :readonly="item.readonly" :size="item.size" :start-placeholder="item.startPlaceholder"
                  :end-placeholder="item.endPlaceholder" :align="item.align" :popper-class="item.popperClass"
                  :range-separator="item.rangeSeparator" :default-value="item.defaultValue"
                  :default-time="item.defaultTime" :name="item.name" :unlink-panels="item.unlinkPanels"
                  :prefix-icon="item.prefixIcon" :clear-icon="item.clearIcon" :validate-event="item.validateEvent"
                  :value-format="item.valueFormat" style="width: 100%;" @change="change(item)"></el-date-picker>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label"
                v-else-if="item.type == 'time' || item.type == 'timerange'" :prop="item.name"
                :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <el-time-select v-model="getLastObj(item.name)[getLastName(item.name)]" :ref="item.name"
                  :type="item.type" :placeholder="item.placeholder" :clearable="item.clearable"
                  :style="{width: getItemWidth(item.width) || innerItemWidth}" :disabled="getDisabled(item)"
                  :editable="item.editable" :format="item.format" :readonly="item.readonly" :size="item.size"
                  :start-placeholder="item.startPlaceholder || '开始日期'" :end-placeholder="item.endPlaceholder || '结束日期'"
                  :is-range="item.isRange" :arrow-control="item.arrowControl" :align="item.align"
                  :popper-class="item.popperClass" :picker-options="item.pickerOptions" :value-format="item.valueFormat"
                  :default-value="item.defaultValue" :name="item.name" :prefix-icon="item.prefixIcon"
                  :clear-icon="item.clearIcon" :range-separator="item.rangeSeparator || '至'" @change="change(item)">
                </el-time-select>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label" v-else-if="item.type == 'number'"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <el-input-number :ref="item.name" :max="item.max === undefined?Infinity:item.max"
                  :min="item.min === undefined? -Infinity:item.min"
                  v-model="getLastObj(item.name)[getLastName(item.name)]"
                  :style="{width: getItemWidth(item.width) || innerItemWidth}" :disabled="getDisabled(item)"
                  :precision="item.precision" :controls="item.controls" :controls-position="item.controlsPosition"
                  @change="change(item)"></el-input-number>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label"
                v-else-if="item.type == 'radio' || item.type === 'btnRadio'" :prop="item.name"
                :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <el-radio-group :ref="item.name" v-model="getLastObj(item.name)[getLastName(item.name)]"
                  :disabled="item.disabled || isViewMode" :size="item.size" :text-color="item.textColor"
                  :fill="item.fill" @change="change(item)">
                  <template v-if="item.type === 'btnRadio'">
                    <el-radio-button v-for="radio in item.radioList" :key="radio.id" :label="radio.id"
                      :name="radio.name" :disabled="getDisabled(item) || radio.disabled">
                      {{ radio.label }}
                    </el-radio-button>
                  </template>
                  <template v-else>
                    <el-radio v-for="radio in item.radioList" :key="radio.id" :label="radio.id" :border="radio.border"
                      :disabled="getDisabled(item) || radio.disabled" :size="radio.size" :name="radio.name">
                      {{ radio.label }}
                    </el-radio>
                  </template>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label" v-else-if="item.type == 'checkbox'"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <el-checkbox-group :ref="item.name" v-model="getLastObj(item.name)[getLastName(item.name)]"
                  :size="item.size" :min="item.min" :max="item.max" :text-color="item.textColor" :fill="item.fill"
                  @change="change(item)">
                  <el-checkbox v-for="it in item.checkboxList" :label="it.id" :key="it.id"
                    :disabled="getDisabled(item) || it.disabled">{{it.name}}
                  </el-checkbox>
                  <template v-if="item.style === 'button'">
                    <el-checkbox-button v-for="op in item.optionsList" :key="op.id" :label="op.id"
                      :true-label="op.trueLabel" :false-label="op.falseLabel"
                      :disabled="getDisabled(item) || it.disabled" :name="op.name" :checked="op.checked">
                      {{ op.label }}
                    </el-checkbox-button>
                  </template>
                  <template v-else>
                    <el-checkbox v-for="op in item.optionsList" :key="op.id" :label="op.id" :true-label="op.trueLabel"
                      :false-label="op.falseLabel" :disabled="getDisabled(item) || it.disabled" :border="op.border"
                      :size="op.size" :name="op.name" :checked="op.checked" :indeterminate="op.indeterminate">
                      {{ op.label }}
                    </el-checkbox>
                  </template>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label" v-else-if="item.type == 'switch'"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <el-switch :ref="item.name" v-model="getLastObj(item.name)[getLastName(item.name)]"
                  @change="change(item)" :disabled="getDisabled(item)">
                  <span slot="open">{{item.openText}}</span>
                  <span slot="close">{{item.closeText}}</span>
                </el-switch>
              </el-form-item>
              <el-form-item v-else-if="item.type === 'cascader'" :label-width="item.labelWidth" :label="item.label"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <el-cascader :show-all-levels="false" v-model="getLastObj(item.name)[getLastName(item.name)]" :props="{
                                    multiple: item.multiple,
                                    value: item.value || 'value',
                                    children: item.childrenName || 'children',
                                    label: item.optionLabelName || 'label'
                                }" :disabled="getDisabled(item) || isViewMode" :options="item.optionsList"
                  :placeholder="item.placeholder" style="width: 100%;">
                </el-cascader>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label"
                v-else-if="item.type == 'select' && !item.spread" :prop="item.name"
                :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <el-select :ref="item.name" :disabled="getDisabled(item)"
                  v-model="getLastObj(item.name)[getLastName(item.name)]" :label-in-value="true" :transfer="true"
                  :clearable="item.clearable" :filterable="item.filterable" :placeholder="item.placeholder"
                  :multiple="item.multiple" :style="{width: getItemWidth(item.width) || innerItemWidth}"
                  :max-tag-count="item.maxTagCount" :max-tag-placeholder="item.maxTagPlaceholder"
                  @on-clear="selectClear(item)" @change="change(item, $event)">
                  <el-option :value="it.id" v-for="it in item.optionsList" :key="it.id" :label="it.label || it.name">
                    <template v-if="!item.render">{{it.label || it.name}}</template>
                    <functional v-else :info="it" :render="item.render"></functional>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label"
                v-else-if="item.type == 'select' && item.spread" :prop="item.name"
                :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <!-- <tagFilter
                                    :style="{width: getItemWidth(item.width) || innerItemWidth}"
                                    v-model="getLastObj(item.name)[getLastName(item.name)]"
                                    :optionsList="item.optionsList"
                                    :multiple="item.multiple"
                                    :isToggle="item.isToggle"
                                    :borderRadius="item.borderRadius"
                                    @change="change(item, $event)"
                            /> -->
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label" v-else-if="item.type == 'textarea'"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <div style="position:relative" :style="{width: getItemWidth(item.width) || innerItemWidth}">
                  <el-input :ref="item.name" type="textarea" :autosize="item.autosize"
                    v-model="getLastObj(item.name)[getLastName(item.name)]" :rows="item.rows"
                    :clearable="item.clearable" :placeholder="item.placeholder" :maxlength="item.maxlength"
                    @change="change(item)" :disabled="getDisabled(item)"></el-input>
                  <div v-if="item.maxlength" class="textarea-tip">
                    {{getLastObj(item.name)[getLastName(item.name)].length}}/{{item.maxlength}}
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label" v-else-if="item.type == 'custom'"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <component :style="{width: getItemWidth(item.width) || innerItemWidth}" v-if="item.component"
                  :ref="item.name" :is="item.component" :config="item"
                  v-model="getLastObj(item.name)[getLastName(item.name)]" :parent="parent"
                  @validate="validateField(item.name)" @change="change(item, $event)"></component>
              </el-form-item>
              <el-form-item :label-width="item.labelWidth" :label="item.label" v-else-if="item.type == 'remote'"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <el-select :ref="item.name" :style="{width: getItemWidth(item.width) || innerItemWidth}"
                  @change="change(item, $event)" v-model="getLastObj(item.name)[getLastName(item.name)]"
                  :clearable="item.clearable" filterable remote :label="model[item.name+'_display']"
                  :remote-method="remoteQuery(item)" :label-in-value="true" :loading="remoteLoading[item.name]">
                  <el-option v-for="(option, index) in item.optionsList" :value="option.id" :key="index">
                    {{option.name}}
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label-width="item.labelWidth" :label="item.label" v-else-if="item.type == 'tree'"
                :prop="item.name" :rules="isViewMode?{}:item.validator">
                <span slot="label">
                  <span v-html="item.label" class="form-plain-type-label"></span>
                  <el-tooltip :content="item.tip" v-if="item.tip">
                    <i class="el-icon-info c-font-sub-color" size="14"></i>
                  </el-tooltip>
                </span>
                <tree-select :ref="item.name" :style="{width: getItemWidth(item.width) || innerItemWidth}"
                  @select="change(item, $event)" v-model="getLastObj(item.name)[getLastName(item.name)]"
                  :multiple="item.multiple" :options="item.optionsList" :load-options="item.loadOptions"
                  :placeholder="item.placeholder" :clearable="item.clearable" :valueConsistsOf="item.valueConsistsOf"
                  :disable-branch-nodes="item.disableBranchNodes" :disabled="getDisabled(item)"></tree-select>
              </el-form-item>
            </template>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import dateUtil from './dateUtils';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import treeSelect from '@riophae/vue-treeselect'
import functional from "./functional";
import Vue from 'vue';
export default {
  components: { functional, treeSelect },
  props: {
    value: {
      type: Object
    },

    formItemList: {
      type: Array
    },

    labelWidth: {
      type: Number,
    },

    cols: {
      type: Number,
      default: 1
    },

    itemWidth: {
      type: [String, Number],
      default: '100%'
    },

    height: {
      type: [String, Number],
    },

    labelPosition: {
      type: String
    },
    groupNameClass: {
      type: String
    },
    isViewMode: {
      type: Boolean
    },
    type: {
      type: String
    },
    parent: {
      type: Object
    },
    requiredWordType: {
      type: Boolean,
      default: false
    },

    container: {
      type: String
    },

    offset: {
      type: Number
    },

    fillType: {
      type: String,
      default: 'none'
    },

    showChangeTip: {
      type: Boolean
    },
    labelColon: {
      type: Boolean
    },

    groupNameVisible: {
      type: Boolean,
      default: true
    },
    inline: {
      type: Boolean,
      default: false
    },
    labelSuffix: {
      type: String
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    inlineMessage: {
      type: Boolean,
      default: false
    },
    statusIcon: {
      type: Boolean,
      default: false
    },
    validateOnRuleChange: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      changedItem: {},
      model: this.value,
      ruleValidate: {},
      remoteLoading: {},
      watchParams: {},
      outputFormatModel: this.value
    }
  },
  created () {
    this.reset()
    this.setDateTypeValueToString()
  },

  watch: {
    model: {
      handler: function (val, oldVal) {
        this.setDateTypeValueToString()
      },
      deep: true
    }
  },

  computed: {
    innerItemWidth () {
      if (typeof this.itemWidth == 'string') {
        return this.itemWidth
      }

      if (typeof this.itemWidth == 'number') {
        return this.itemWidth + 'px'
      }
    },

    innerLabelWidth () {
      return this.labelWidth + 'px'
    },

    formStyle () {
      if (!this.height) {
        return {}
      } else {
        let height = null
        if (typeof this.height == 'string') {
          height = this.height
        }

        if (typeof this.height == 'number') {
          height = this.height + 'px'
        }

        return {
          height: height,
          overflow: 'auto'
        }
      }

    },

    rows () {
      let cellCols = 24 / this.cols
      let lastGroupName = '///'
      let res = []
      let lastInUseCols = 0

      _.each(this.formItemList, (it) => {
        if ((typeof it.usable === 'boolean') && it.usable === false) {
          return
        }

        if (typeof it.visible === 'boolean') {
          it.hidden = !it.visible
        }

        let cols = it.span || 1
        let lastUnuseCols = this.cols - lastInUseCols

        it.inerspan = (it.span || 1) * cellCols

        if (it.groupName != lastGroupName) {
          lastGroupName = it.groupName
          lastUnuseCols = 0
          lastInUseCols = cols
          res.push({
            groupName: it.groupName,
            rows: [{ cols: [it] }]
          })
          return
        }

        if (cols <= lastUnuseCols) {
          res[res.length - 1].rows[res[res.length - 1].rows.length - 1].cols.push(it)
          lastInUseCols += cols
        } else {
          lastInUseCols = cols
          res[res.length - 1].rows.push({
            cols: [it]
          })
        }
      })

      if (this.fillType === 'stretch' || this.fillType === 'vacant') {
        _.each(res, (it) => {
          _.each(it.rows, (it2) => {
            let cols = 0
            _.each(it2.cols, (it3) => {
              cols += it3.inerspan
            })

            if (cols < 24) {
              if (this.fillType === 'stretch') {
                it2.cols[it2.cols.length - 1].inerspan += (24 - cols)
              } else {
                let last = (24 - cols) / (24 / this.cols)
                let lastOne = it2.cols[it2.cols.length - 1]
                let newOne = {
                  vacant: true,
                  inerspan: cellCols
                }

                if (lastOne.groupName !== undefined) {
                  newOne.groupName = lastOne.groupName
                }

                for (let i = 0; i < last; i++) {
                  it2.cols.push(_.cloneDeep(newOne))
                }
              }
            }
          })
        })
      }
      return res
    },
  },
  mounted () {
    if (this.container) {
      document.querySelector(this.container).addEventListener('scroll', this.onScroll)
    }
  },
  methods: {
    resetItems () {
      let cellCols = 24 / this.cols
      let lastGroupName

      _.each(this.formItemList, (it) => {
        let cols = it.span || 1
        let lastUnuseCols = this.cols - this.rows[this.rows.length - 1].inUseCols
        let newRow = {}

        if (it.groupName && it.groupName != lastGroupName) {
          this.rows.push({
            groupName: it.groupName
          })
          lastGroupName = it.groupName
          lastUnuseCols = 0
        }

        if (lastGroupName && !it.groupName) {
          return
        }

        it.inerspan = (it.span || 1) * cellCols

        if (cols <= lastUnuseCols) {
          this.rows[this.rows.length - 1].cols.push(it)
          this.rows[this.rows.length - 1].inUseCols += cols
        } else {
          newRow.inUseCols = cols
          newRow.cols = [it]
          this.rows.push(newRow)
        }
      })
    },

    getItemByName (name) {
      return _.find(this.formItemList, it => it.name === name)
    },

    getItemWidth (itemWidth) {
      if (typeof itemWidth == 'string') {
        return itemWidth
      }

      if (typeof itemWidth == 'number') {
        return itemWidth + 'px'
      }
    },
    getDefaultValue (it, isGetInitValue) {
      let model = this.getLastObj(it.name)
      let name = this.getLastName(it.name)

      let value = undefined

      if (model[name] !== undefined && !isGetInitValue) {
        return model[name]
      }

      if (it.default) {
        return it.default
      }

      switch (it.type) {
        case 'tree':
          value = it.multiple ? [] : null
          break;

        case 'checkbox':
          value = it.multiple ? [] : null
          return

        case 'number':
        case 'radio':
          value = null
          break

        case 'remote':
        case 'input':
        case 'textarea':
          value = ''
          break

        case 'slider':
          value = it.range ? [it.min || 0, it.min || 0] : 0
          break;

        case 'switch':
          value = false
          break;

        case 'select':
          value = it.multiple ? [] : ''
          break

        case 'custom':
          value = undefined
      }

      return value
    },
    reset () {
      _.each(this.formItemList, (it, index) => {
        if (it.name) {
          Vue.set(this.changedItem, it.name, false)
        }
        if (it.vacant) {
          return
        }
        if (typeof it.usable === 'function') {
          it.usableFunc = it.usable
        }

        if (typeof it.visible === 'function') {
          it.visibleFunc = it.visible
        }

        if (it.type === 'input') {
          it.clearable = it.clearable === undefined ? true : it.clearable
        }

        this.initValue(it.name)
        let model = this.getLastObj(it.name)
        let name = this.getLastName(it.name)
        Vue.set(model, name, this.getDefaultValue(it))
        switch (it.type) {
          case 'tree':
            break;
          case 'checkbox':
            this.listFromUrl(it, 'checkboxList')
            break;
          case 'radio':
            this.listFromUrl(it, 'radioList')
            break;
          case 'input':
          case 'textarea':
            if (it.password) {
              Vue.set(it, 'passwordVisible', true)
            }
            break;
          case 'number':
            break;
          case 'slider':
            break;
          case 'switch':
            break;
          case 'remote':
            if (this.remoteLoading[name] === undefined) {
              Vue.set(this.remoteLoading, name, false)
            }

            if (!it.optionsLoading) {
              it.optionsLoading = true
              Vue.set(it, 'optionsList', [])
            }

            let watchName = name.replace(/\>/g, "__")

            Vue.set(this.watchParams, watchName, {})

            this.watchParams[watchName] = it.params

            if (!it.hidden) {
              this.remoteQuery(it)('')
            }

            break;
          case 'select':
            if (it.clearable === undefined) {
              Vue.set(it, 'clearable', true)
            }
            if (it.params === undefined) {
              Vue.set(it, 'params', {})
            }
            this.listFromUrl(it, 'optionsList')
            break;
          case 'custom':
            // this.$watch(function () {
            //     return model[name]
            // }, (newVal, oldVal) => {
            //     this.change(it)
            // })
            break;
          default:
        }

        Vue.set(it, 'hidden', it.hidden || false)

        if (it.validator) {
          Vue.set(this.ruleValidate, it.name, it.validator)
        }

        if (it.linkage) {
          this.$watch(function () {
            return model[name]
          }, (newVal, oldVal) => {
            _.each(it.linkage, (it) => {
              let sourceName = name, targetName = it
              if (it.indexOf(':') !== -1) {
                let t = it.split(':')
                sourceName = t[1]
                targetName = t[0]
              }

              let linkageItem = _.find(this.formItemList, (it) => { return it.name === targetName })

              let model2 = this.getLastObj(this.model, linkageItem.name)
              let name2 = this.getLastName(linkageItem.name)
              model2[name2] = this.getDefaultValue(linkageItem, true)

              if (linkageItem.params) {
                Vue.set(linkageItem.params, sourceName, newVal)
              }
            })
          })
        }
      })

      this.checkExpression()
    },

    listFromUrl (item, listName) {
      if (!item.url) {
        return
      }
      item.reload = () => {
        let model = this.getLastObj(item.name)
        let url = null, method = null
        if (this.mock) {
          url = '/mock/' + item.url
          method = 'get'
        } else {
          let gUrl = Lit.getApi(item.url)
          if (gUrl) {
            var t = gUrl.split(':')
            url = t[1]
            method = t[0]
          } else {
            url = item.url
            method = item.method || 'get'
          }
        }
        let params = item.params || {}
        params._noLoading = true
        window.__ajax[method](url, item.params).then((res) => {
          if (item.afterAjax) {
            res = item.afterAjax(res)
          }
          let result = this.pickData(res, item.root || 'result')
          _.each(result, (it2) => {
            it2.id = it2[item.valueMember || 'id']
            it2.name = this.getDisplayMember(it2, item)
            if (item.labelMember) {
              it2.label = it2[item.labelMember]
            }
          })

          Vue.set(item, listName, result)

          if (model[name]) {
            let finded = _.find(item[listName], (it2) => {
              return it2.id == model[name]
            })
            if (finded) {
              this.change(item, { label: finded.name })
            }
          }
        })
      }

      if (!item.hidden) {
        item.reload()
      }

      let watchName = item.name.replace(/\>/g, "__")
      Vue.set(this.watchParams, watchName, {})

      this.watchParams[watchName] = item.params

      this.$watch('watchParams.' + watchName, {
        deep: true, handler: () => {
          item.reload()
        }
      })

      this.$watch(function () {
        return item.hidden
      }, () => {
        if (!item.hidden && !item.checkboxList) {
          item.reload()
        }
      })
    },

    initValue (name) {
      let spl = name.split('.')
      let t = this.model

      _.each(spl, (it, index) => {
        if (index < spl.length - 1) {
          if (!t[it]) {
            Vue.set(t, it, {})
          }
          t = t[it]
        }
      })
    },

    getLastName (name) {
      let spl = name.split('.')

      return spl[spl.length - 1]
    },

    pickData (data, root) {
      var tempValue = data
      var rootArray = root.split('>')
      rootArray.forEach(function (item) {
        if (tempValue[item] === undefined) {
          return false
        }
        tempValue = tempValue[item]
      })
      return tempValue
    },

    getDisplayMember (data, meta) {
      if (meta.displayRender) {
        return meta.displayRender(data)
      } else {
        return data[meta.displayMember || 'name']
      }
    },

    change (item, value) {
      this.$nextTick(() => {
        this.changedItem[item.name] = true
        var t = {
          name: item.name,
          label: item.label,
          value: this.getLastObj(item.name)[this.getLastName(item.name)],
          item: item
        }

        // 如果是select 把显示值也塞到model中
        if (item.type == 'select') {
          t.value_display = value ? value.label : ''
          this.getLastObj(item.name)[this.getLastName(item.name) + '_display'] = value ? value.label : ''
        }

        if (item.type == 'remote') {
          t.value_display = value.label
          this.getLastObj(item.name)[this.getLastName(item.name) + '_display'] = value ? value.label : ''
        }

        if (item.type === 'custom') {
          t.extend = value
        }

        this.$emit('input', this.model)

        this.$nextTick(() => {
          this.$emit('on-change', t)
        })
        this.checkExpression()
      })
    },

    setDateTypeValueToString () {
      let model = _.cloneDeep(this.model)

      _.each(this.formItemList, (it, index) => {
        if (it.vacant) {
          return
        }
        let value = this.getLastObj(it.name)[this.getLastName(it.name)]

        if (value && it.outputFormat) {
          if (value instanceof Date) {
            value = dateUtil.format(value, it.outputFormat)
          } else if (value instanceof Array) {
            _.each(value, (it2, index) => {
              if (it2 instanceof Date) {
                value[index] = dateUtil.format(it2, it.outputFormat)
              }
            })
          }

          this.getLastObj(it.name)[this.getLastName(it.name)] = value
        }
      })

      this.outputFormatModel = model
    },

    checkExpression () {
      var model = this.model
      _.each(this.formItemList, (it, index) => {
        if (it.visibleFunc && typeof it.visibleFunc === 'function') {
          it.hidden = !it.visibleFunc(it, model)
        }

        if (it.usableFunc && typeof it.usableFunc === 'function') {
          it.usable = it.usableFunc(it, model)
        }
      })
    },

    getModel () {
      return this.outputFormatModel
    },

    validate (options) {
      return this.$refs.form.validate(options)
    },

    validateField (field) {
      this.$refs.form.validateField(field)
    },

    resetFields () {
      this.$refs.form.resetFields()
    },

    goAnchor (groupName) {
      let anchor = this.$el.querySelector('[data-anchor="' + groupName + '"]');
      let total = anchor.offsetTop + (this.offset || 0);
      let container = document.querySelector(this.container)
      let distance = container.scrollTop;
      let step = total / 30;
      if (total > distance) {
        smoothDown();
      } else {
        let newTotal = distance - total;
        step = newTotal / 30;
        smoothUp();
      }

      function smoothDown () {
        if (distance < total) {
          distance += step;
          container.scrollTop = distance;
          setTimeout(smoothDown, 10);//自定义时间
        } else {
          container.scrollTop = total;
        }
      }

      function smoothUp () {
        if (distance > total) {
          distance -= step;
          container.scrollTop = distance;
          setTimeout(smoothUp, 10);
        } else {
          container.scrollTop = total;
        }
      }
    },

    getFormItemInstance (name) {
      let ref = this.$refs[name]

      if (ref instanceof Array) {
        ref = ref[0]
      }

      if (ref.page) {
        return ref.$refs.page
      } else if (ref.sectionName || ref.sectionUrl) {
        return ref.$refs.section
      } else {
        return ref
      }
    },

    remoteQuery (item) {
      return (query) => {
        this.remoteLoading[item.name] = true

        var params = item.params || {}

        if (query) {
          params['_dynamic_cnd'] = JSON.stringify({
            query: [{
              name: item.searchKey,
              values: [{ operation: 'like', value: query }]
            }]
          })
        } else {
          delete params._dynamic_cnd
        }

        this.$dataSource({
          api: item.url,
          params: params,
          success: (res) => {
            item.optionsList = _.map(res.result, (it) => {
              return {
                id: it[item.valueMember || 'id'],
                name: this.getDisplayMember(it, item)
              }
            })
            this.remoteLoading[item.name] = false
          }
        })
      }
    },
    getDisabled (item) {
      if (typeof item.disabled === 'function') {
        return item.disabled(item, this.model)
      } else {
        return item.disabled
      }
    },
    getLastName (name) {
      let spl = name.split('.')

      return spl[spl.length - 1]
    },

    getLastObj (name) {
      let spl = name.split('.')
      let t = this.model

      _.each(spl, (it, index) => {
        if (index < spl.length - 1) {
          t = t[it]
        }
      })

      return t
    },

    selectClear (item) {
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.getLastObj(item.name)[this.getLastName(item.name)] = item.multiple ? [] : ''
        })
      })
    },
    viewRender (value, config) {
      if (!config.viewRender) {
        return value
      } else {
        return config.viewRender(value, config)
      }
    },
    validate (options) {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (options && options.success) {
              options.success()
            } else {
              resolve()
            }
          } else {
            if (options && options.fail) {
              options.fail()
            } else {
              reject()
            }
          }
        })
      })
    },

    onScroll () {
      let scrolled = document.querySelector(this.container).scrollTop
      let groupElems = this.$refs.groupName
      let res = []

      _.each(groupElems, (it) => {
        res.push(it.offsetTop + (this.offset || 0))
      })

      let current = null


      if (scrolled < res[0]) {
        current = 0
      }

      if (scrolled >= res[res.length - 1]) {
        current = res.length - 1
      }
      _.each(res, (it, index) => {
        if (scrolled >= it && scrolled < res[index + 1]) {
          current = index
        }
      })
      this.$emit('on-scroll-group-name-change', groupElems[current].dataset.anchor)
    },
  }
}
</script>
<style lang="less">
.value-label {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
}
</style>