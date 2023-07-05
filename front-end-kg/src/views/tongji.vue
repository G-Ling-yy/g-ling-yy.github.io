<template>
  <div class="views-container">
    <!-- <el-table
      ref="tableFormatData"
      border
      :span-method="objectSpanMethod"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="55" align="center" prop="id" />
      <el-table-column label="订单编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bjd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="委托编号" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.ypbh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.name3 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物流信息" align="center">
        <template slot-scope="scope">
          <p>顺丰快递</p>
          <p>JD0015972385147</p>
        </template>
      </el-table-column>
      <el-table-column label="报检日期" align="center" width="100">
        <template slot-scope="scope">
          <span>2020-04-27</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="70">
        <template slot-scope="scope">
          <span>状态</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <div class="operation-group">
            <el-button type="text">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table> -->
    <el-tree
      class="tree-line"
      icon-class="el-icon-circle-plus-outline"
      :indent="0"
      :data="data"
      @node-click="handleNodeClick"
    >
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "TaskList",
  data() {
    return {
      tableData: [
        {
          id: "1",
          bjd: "BJ20200521001",
          ypbh: "000001",
          price: 20,
          name1: "隔音门",
          name2: "2018-11-14",
          name3: "14",
        },
        {
          id: "1",
          bjd: "BJ20200521001",
          ypbh: "000002",
          price: 20,
          name1: "隔音门",
          name2: "",
          name3: "",
        },
        {
          id: "2",
          bjd: "BJ20200521002",
          ypbh: "000004",
          price: 20,
          name1: "隔音门",
          name2: "14",
          name3: "",
        },
        {
          id: "2",
          bjd: "BJ20200521002",
          ypbh: "000003",
          price: 40,
          name1: "隔音门",
          name2: "2018-11-14",
          name3: "14",
        },
      ],
      spanArr: [],
      trArr: [],
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                },
              ],
            },
          ],
        },
        {
          id: 21,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 31,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    // 合并表格
    var contactDot = 0;
    const newTabdata = this.tableData;
    this.tableData.forEach((item, index) => {
      console.log(item.name2.length, "item.name2.length");
      // 合并行
      if (item.name2.length !== 0 && item.name3.length === 0) {
        this.trArr.push(1);
      } else if (item.name2.length === 0 && item.name3.length === 0) {
        this.trArr.push(2);
      } else {
        this.trArr.push(0);
      }
      // 合并列。根据bjd合并
      if (index === 0) {
        this.spanArr.push(1);
      } else {
        // 遍历需要合并的名字 bjd
        if (item.bjd === newTabdata[index - 1].bjd) {
          this.spanArr[contactDot] += 1;
          this.spanArr.push(0);
        } else {
          contactDot = index;
          this.spanArr.push(1);
        }
      }
    });
    console.log(this.trArr, "ront");
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(rowIndex, columnIndex)
      var hbArr = null;
      var hbArr5 = null;
      var hbArr6 = null;
      this.trArr.map((item, index) => {
        if (columnIndex === 4 && rowIndex === index) {
          if (item === 2) {
            hbArr = {
              rowspan: 1,
              colspan: 3,
            };
          }
        }
        if (columnIndex === 5 && rowIndex === index) {
          if (item === 1) {
            hbArr5 = {
              rowspan: 1,
              colspan: 2,
            };
          }
          if (item === 2) {
            hbArr5 = {
              rowspan: 0,
              colspan: 0,
            };
          }
        }
        if (columnIndex === 6 && rowIndex === index) {
          if (item === 1) {
            hbArr6 = {
              rowspan: 0,
              colspan: 0,
            };
          }
          if (item === 2) {
            hbArr6 = {
              rowspan: 0,
              colspan: 0,
            };
          }
        }
      });
      // 返回合并列，合并列的空数据
      if (columnIndex === 4 && hbArr) {
        console.log(hbArr, "hbArr");
        return hbArr;
      }
      if (columnIndex === 5 && hbArr5) {
        console.log(hbArr5, "hbArr5");
        return hbArr5;
      }
      if (columnIndex === 6 && hbArr6) {
        console.log(hbArr6, "hbArr6");
        return hbArr6;
      }

      // columnIndex 0 就是第0列，后面相对改,columnIndex 0 就是第0列，后面相对改，合并第 0,1,2列相同数据，就是多选，订单编号，委托编号3列
      if (columnIndex === 0) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      if (columnIndex === 1) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      if (columnIndex === 2) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },

     handleNodeClick(data) {
        console.log(data,'1111');
      }
  },
};
</script>
<style lang="less">

.tree-line{
  .el-tree-node {
    position: relative;
    padding-left: 16px !important; // 缩进量
  }
  .el-tree-node__children {
    padding-left: 16px; // 缩进量
  }

  // 竖线
  .el-tree-node::before {
    content: "";
    height: 100%;
    width: 1px;
    position: absolute;
    left: -3px;
    top: -26px;
    border-width: 1px;
    border-left: 1px dashed #52627C;
  }
  // 当前层最后一个节点的竖线高度固定
  .el-tree-node:last-child::before {
    height: 38px; // 可以自己调节到合适数值
  }

  // 横线
  .el-tree-node::after {
    content: "";
    width: 24px;
    height: 20px;
    position: absolute;
    left: -3px;
    top: 12px;
    border-width: 1px;
    border-top: 1px dashed #52627C;
  }

  // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }
	
  // 展开关闭的icon
  .el-tree-node__expand-icon{
    font-size: 16px;
    // 叶子节点（无子节点）
    &.is-leaf{
      color: transparent;
      // display: none; // 也可以去掉
    }
  }
}
</style>