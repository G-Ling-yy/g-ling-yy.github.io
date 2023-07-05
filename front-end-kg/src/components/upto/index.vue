<template>
  <div class="upto">
    <!-- d-linele -->
    <div class="d-inline">
      <div class="d-inline-block">
        <div class="d-block">
          <div class="d-table">
            <div class="d-table-row">
              <div class="d-table-cell">表格</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- flex -->
    <div class="d-flex">
      <div class="d-inline-flex">
        <div class="flex-row">
          <div class="flex-column">flex</div>
        </div>
      </div>
    </div>
    <div class="flex-column-reverse"></div>
    <div class="flex-wrap"></div>
    <div class="flex-nowrap"></div>
    <div class="flex-wrap-reverse"></div>
    <div class="justify-content-start"></div>
    <div class="justify-content-end"></div>
  </div>
</template>

<script>
import mixin from './mixin.js'

export default {
  name: 'upto',

  mixins: [mixin],

  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(
                start.getTime() - 3600 * 1000 * 24 * 7
              )
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(
                start.getTime() - 3600 * 1000 * 24 * 30
              )
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(
                start.getTime() - 3600 * 1000 * 24 * 90
              )
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      value1: [
        new Date(2000, 10, 10, 10, 10),
        new Date(2000, 10, 11, 10, 10)
      ],
      value2: ''
    }
  },

  created() {
    console.log('%cfear', 'color: #aaa')
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName] &&
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
    },

    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(
        item
      )
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },

    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      })
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region' }])
      }
      if (node.level > 1) return resolve([])

      setTimeout(() => {
        const data = [
          {
            name: 'leaf',
            leaf: true
          },
          {
            name: 'zone'
          }
        ]

        resolve(data)
      }, 500)
    },

    resetForm(formName) {
      this.$refs[formName] &&
        this.$refs[formName].resetFields()
    },

    onChangeText() {
      if (
        this.atPos(text, this.state.input) &&
        this.state.conversationType ===
          ConversationType.GROUP
      ) {
        this.props.navigation.navigate('Contacts', {
          id: this.state.targetId,
          onSelect: user => {
            this.state.atUsers.push({
              userName: '@' + user.userName,
              id: user.id
            })
            this.setState(
              {
                input: text + user.userName + ' '
              },
              async () => {
                await Utils.sleep(200)
                this.refs['TextInput'].focus()
              }
            )
          }
        })
      }
      if (this.state.input.length - text.length === 1) {
        for (
          let i = 0;
          i < this.state.atUsers.length;
          i++
        ) {
          const d =
            this.state.input.length -
            this.state.atUsers[i].userName.length
          if (
            d >= 0 &&
            this.state.input.lastIndexOf(
              this.state.atUsers[i].userName
            ) === d
          ) {
            text = this.state.input.substring(0, d)
            this.state.atUsers.splice(i, 1)
            break
          }
        }
      }
      if (text.length === 0) {
        this.state.atUsers = []
      }
      this.setState({
        input: text
      })
    }
  }
}
</script>

<style lang="less" scoped>
.upto {
  .d-inline {
    display: inline;
  }
  .d-inline-block {
    display: inline-block;
  }
  .d-block {
    display: block;
  }
  .d-table {
    display: table;
  }
  .d-table-row {
    display: table-row;
  }
  .d-table-cell {
    display: table-cell;
  }
  .d-flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  .d-inline-flex {
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
  }
  .flex-row {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
  }
  .flex-column {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }
  .flex-row-reverse {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: reverse;
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse;
  }
  .flex-column-reverse {
    -webkit-box-orient: vertical;
    -webkit-box-direction: reverse;
    -ms-flex-direction: column-reverse;
    flex-direction: column-reverse;
  }
  .flex-wrap {
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .flex-nowrap {
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
  }
  .flex-wrap-reverse {
    -ms-flex-wrap: wrap-reverse;
    flex-wrap: wrap-reverse;
  }
  .justify-content-start {
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
  }
  .justify-content-end {
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
  }
  .justify-content-center {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  .justify-content-between {
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }
  .justify-content-around {
    -ms-flex-pack: distribute;
    justify-content: space-around;
  }
  .align-items-start {
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
  }
  .align-items-end {
    -webkit-box-align: end;
    -ms-flex-align: end;
    align-items: flex-end;
  }
  .align-items-center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .align-items-baseline {
    -webkit-box-align: baseline;
    -ms-flex-align: baseline;
    align-items: baseline;
  }
  .align-items-stretch {
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
  }
  .align-content-start {
    -ms-flex-line-pack: start;
    align-content: flex-start;
  }
  .align-content-end {
    -ms-flex-line-pack: end;
    align-content: flex-end;
  }
  .align-content-center {
    -ms-flex-line-pack: center;
    align-content: center;
  }
  .align-content-between {
    -ms-flex-line-pack: justify;
    align-content: space-between;
  }
  .align-content-around {
    -ms-flex-line-pack: distribute;
    align-content: space-around;
  }
  .align-content-stretch {
    -ms-flex-line-pack: stretch;
    align-content: stretch;
  }
  .align-self-auto {
    -ms-flex-item-align: auto;
    align-self: auto;
  }
  .align-self-start {
    -ms-flex-item-align: start;
    align-self: flex-start;
  }
  .align-self-end {
    -ms-flex-item-align: end;
    align-self: flex-end;
  }
  .align-self-center {
    -ms-flex-item-align: center;
    align-self: center;
  }
  .align-self-baseline {
    -ms-flex-item-align: baseline;
    align-self: baseline;
  }
  .align-self-stretch {
    -ms-flex-item-align: stretch;
    align-self: stretch;
  }
  .item-tiling > * {
    width: 100%;
  }
  .btn {
    margin-left: 8px;
    margin-right: 8px;
    margin-top: 6px;
    margin-bottom: 6px;
    padding: 0 8px;
    display: inline-block;
    font-size: 14px;
    border-radius: 4px;
    text-align: center;
    border: none;
    background-color: transparent;
    height: 34px;
    line-height: 32px;
    min-width: 72px;
    cursor: pointer;
  }
  .btn.btn-sm {
    margin-top: 6px;
    margin-bottom: 6px;
    height: 30px;
    line-height: 28px;
    min-width: 72px;
  }
  .btn-gray {
    color: #f6f6f6;
    border: 1px solid #999;
    background-color: #999;
    -webkit-transition: background-color 0.1s ease-in-out,
      border-color 0.1s ease-in-out;
    transition: background-color 0.1s ease-in-out,
      border-color 0.1s ease-in-out;
  }
  .btn-gray[disabled] {
    background-color: #eaeaea;
    border-color: #eaeaea;
    color: #d6d6d6;
  }
  .btn-gray[disabled]:hover {
    background-color: #eaeaea;
    border-color: #eaeaea;
    color: #d6d6d6;
  }
  .btn-gray[disabled]:active {
    background-color: #eaeaea;
    border-color: #eaeaea;
    color: #d6d6d6;
  }
  .btn-gray:hover {
    background-color: #adadad;
    border-color: #adadad;
  }
  .btn-gray:active {
    background-color: #7a7a7a;
    border-color: #7a7a7a;
  }
  .btn-red {
    color: #fff;
    border: 1px solid #ca0c16;
    background-color: #ca0c16;
    -webkit-transition: background-color 0.1s ease-in-out,
      border-color 0.1s ease-in-out;
    transition: background-color 0.1s ease-in-out,
      border-color 0.1s ease-in-out;
  }
  .btn-red[disabled] {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-red[disabled]:hover {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-red[disabled]:active {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-red:hover {
    background-color: #f21f2b;
    border-color: #f21f2b;
  }
  .btn-red:active {
    background-color: #a20a12;
    border-color: #a20a12;
  }
  .btn-blue {
    color: #f6f6f6;
    border: 1px solid #79a5e5;
    background-color: #79a5e5;
    -webkit-transition: background-color 0.1s ease-in-out,
      border-color 0.1s ease-in-out;
    transition: background-color 0.1s ease-in-out,
      border-color 0.1s ease-in-out;
  }
  .btn-blue[disabled] {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-blue[disabled]:hover {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-blue[disabled]:active {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-blue:hover {
    background-color: #94b7ea;
    border-color: #94b7ea;
  }
  .btn-blue:active {
    background-color: #3e7eda;
    border-color: #3e7eda;
  }
  .btn-gray-hollow {
    color: #999;
    border: 1px solid #999;
    background-color: #fff;
    -webkit-transition: background-color 0.1s ease-in-out;
    transition: background-color 0.1s ease-in-out;
  }
  .btn-gray-hollow[disabled] {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-gray-hollow[disabled]:hover {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-gray-hollow[disabled]:active {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-gray-hollow:hover {
    background-color: #f5f5f5;
    border-color: #999;
  }
  .btn-gray-hollow:active {
    background-color: #ebebeb;
    border-color: #999;
  }
  .btn-red-hollow {
    color: #ca0c16;
    border: 1px solid #ca0c16;
    background-color: #fff;
    -webkit-transition: background-color 0.1s ease-in-out;
    transition: background-color 0.1s ease-in-out;
  }
  .btn-red-hollow[disabled] {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-red-hollow[disabled]:hover {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-red-hollow[disabled]:active {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-red-hollow:hover {
    background-color: #fde3e4;
    border-color: #ca0c16;
  }
  .btn-red-hollow:active {
    background-color: #fcc7ca;
    border-color: #ca0c16;
  }
  .btn-blue-hollow {
    color: #79a5e5;
    border: 1px solid #79a5e5;
    background-color: #fff;
    -webkit-transition: background-color 0.1s ease-in-out;
    transition: background-color 0.1s ease-in-out;
  }
  .btn-blue-hollow[disabled] {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-blue-hollow[disabled]:hover {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-blue-hollow[disabled]:active {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-blue-hollow:hover {
    background-color: #f2f6fc;
    border-color: #79a5e5;
  }
  .btn-blue-hollow:active {
    background-color: #e4edfa;
    border-color: #79a5e5;
  }
  .btn-yellow-hollow {
    color: #f69802;
    border: 1px solid #f69802;
    background-color: #fff;
    -webkit-transition: background-color 0.1s ease-in-out;
    transition: background-color 0.1s ease-in-out;
  }
  .btn-yellow-hollow[disabled] {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-yellow-hollow[disabled]:hover {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-yellow-hollow[disabled]:active {
    background-color: #e3e3e3;
    border-color: #e3e3e3;
    color: #c1c1c1;
  }
  .btn-yellow-hollow:hover {
    background-color: #fff5e5;
    border-color: #f69802;
  }
  .btn-yellow-hollow:active {
    background-color: #ffebcb;
    border-color: #f69802;
  }
  .btn-link-gray {
    color: #666;
  }
  .btn-link-gray[disabled] {
    color: #eaeaea;
  }
  .btn-link-gray:hover {
    color: #858585;
  }
  .btn-link-gray:active {
    color: #525252;
  }
  .btn-link-blue {
    color: #79a5e5;
  }
  .btn-link-blue[disabled] {
    color: #eaeaea;
  }
  .btn-link-blue:hover {
    color: #94b7ea;
  }
  .btn-link-blue:active {
    color: #3e7eda;
  }
  .clearfix::after {
    display: block;
    content: '';
    clear: both;
  }
  .pull-right,
  .float-right {
    float: right;
  }
  .pull-left,
  .float-left {
    float: left;
  }
  .pull-none,
  .float-none {
    float: none;
  }
  .center-block {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
  }
  .text-justify {
    text-align: justify;
  }
  .text-nowrap {
    white-space: nowrap;
  }
  .text-lowercase {
    text-transform: lowercase;
  }
  .text-uppercase {
    text-transform: uppercase;
  }
  .text-capitalize {
    text-transform: capitalize;
  }
  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .font-weight-light {
    font-weight: 300;
  }
  .font-weight-normal {
    font-weight: normal;
  }
  .font-weight-bold {
    font-weight: bold;
  }
  .font-italic {
    font-style: italic;
  }
  .c-red {
    color: #ca0c16;
  }
  .c-red-hover:hover {
    color: #cf232c;
  }
  .c-red-focus:focus {
    color: #b60a13;
  }
  .c-blue {
    color: #79a5e5;
  }
  .c-blue-hover:hover {
    color: #86aee7;
  }
  .c-blue-focus:focus {
    color: #6d94ce;
  }
  .c-gray {
    color: #999;
  }
  .c-gray-hover:hover {
    color: #adadad;
  }
  .c-gray-focus:focus {
    color: #b50a13;
  }
  .mask-dark {
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 150;
  }
  .dropup,
  .dropdown {
    position: relative;
    display: inline-block;
  }
  svg.icon {
    -webkit-transition: fill 0.1s ease-in-out,
      -webkit-transform 0.1s ease-in-out;
    transition: fill 0.1s ease-in-out,
      -webkit-transform 0.1s ease-in-out;
    transition: transform 0.1s ease-in-out,
      fill 0.1s ease-in-out;
    transition: transform 0.1s ease-in-out,
      fill 0.1s ease-in-out,
      -webkit-transform 0.1s ease-in-out;
  }
  .dropdown-toggle:focus {
    outline: 0;
  }
  .dropdown-face {
    padding: 0 8px;
    display: block;
    background: #fff;
    border: 1px solid #c1c1c1;
    border-radius: 4px;
    width: 200px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #333;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    -webkit-transition: border-color 0.1s ease-in-out;
    transition: border-color 0.1s ease-in-out;
  }
}
</style>
