<template>
  <div class="control-box">
    <div class="container">
      <div class="item-box">
        <el-row :gutter="20">
          <el-col :span="5"></el-col>
          <el-col :span="5"></el-col>
          <el-col :span="5"></el-col>
          <el-col :span="5"></el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <div class="item-box">
        <div id="chartBox1"></div>
      </div>
      <div class="item-box">
        <div id="chartBox2"></div>
      </div>

      <div class="item-box">
        <div class="pie-chart">
          <div id="abnormal-chart"></div>
        </div>
        <div class="bar-chart">
          <div id="province-state-chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
  export default {
    components:{
      //ControlNavBar,
    },
    data(){
      return {
        pieCharts: '',
        lineChart: '',
        lineChart2: '',
        barCharts: '',
        insertData: [],
        abnormalData: [],
        insertList:[],
        cityVideoData:[]
      };
    },
    computed:{
      ...mapState([
        "userInfo",
      ]),
    },
    mounted() {
      this.$nextTick(()=> {
        this.loadBasicData();
        this.drawLine('chartBox1','视频设备接入数量',this.insertList,this.insertData,'#1c71f0');
        this.drawLine('chartBox2','视频设备故障数量',this.insertList,this.abnormalData,'#ff780c');
        this.queryCameraState();
      })

      /*window.addEventListener("resize", () => {
        //console.info("this.$echarts ", this.$echarts);
        this.pieCharts.resize();
        this.lineChart.resize();
        this.lineChart2.resize();
        this.barCharts.resize();
      });*/
    },
    methods:{
      ...mapActions([
        'getDeviceStatistics',
      ]),

      /**
       * 折线图加载函数
       * @param id
       */
      drawLine(id,title,list,data,color) {
        this.lineChart = this.$echarts.init(document.getElementById(id))
        this.lineChart.setOption({
          tooltip: {
            trigger: 'item',
            position: function(point, params, dom, rect, size){
              //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
              var x = point[0];//
              var y = point[1];
              var viewWidth = size.viewSize[0];
              var viewHeight = size.viewSize[1];
              var boxWidth = size.contentSize[0];
              var boxHeight = size.contentSize[1];
              var posX = 0;//x坐标位置
              var posY = 0;//y坐标位置

              if(x<boxWidth){//左边放不开
                posX = 5;
              }else{//左边放的下
                posX = x-boxWidth/2;
              };
              if(y<boxHeight){//上边放不开
                posY = 5;
              }else{//上边放得下
                posY = y-boxHeight-13;
              };
              return [posX,posY];
            },
            formatter: function (params) {
              return `<div class="tooltip-box">${params.data}</div>`;
            },
            backgroundColor: 'transparent',
          },
          title: {
            left: 'center',
            text: title,
            textStyle: {
              fontSize:15,
              fontWeight: 'bold'
            }
          },
          grid: {
            top:'20%',
            left: '3%',
            right: '4%',
            bottom: '8%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: list,
            //网格样式
            splitLine: {
              show: true,
              lineStyle:{
                color: ['rgba(157, 157, 157, 0.3)'],
                width: 1,
                type: 'dashed'
              }
            },
            axisLabel: {
              margin:18,
            },
          },
          yAxis: {
            type: 'value',
            //网格样式
            splitLine: {
              show: true,
              lineStyle:{
                color: ['rgba(157, 157, 157, 0.3)'],
                width: 1,
                type: 'dashed'
              }
            },
            axisLabel: {
              margin:18,
            },
          },
          series: [{
            name: '',
            type: 'line',
            stack: '总量',
            data: data,
            symbolSize:7,
            itemStyle:{
              normal:{
                color:color,
                lineStyle: {
                  color: color,
                  width:1.5
                }
              }
            }
          }]
        })
      },

      /**
       * 饼图加载函数
       * @param
       */
      pieChart(id,chartData, chartDataTotal) {
        // 基于准备好的dom，初始化echarts实例
        let obj = document.getElementById(id);
        if(!obj){
          return false;
        }
        console.log("obj=>",obj)

        this.pieCharts = this.$echarts.init(obj);

        // 绘制图表
        this.pieCharts.setOption({
          tooltip: {
            show: true,
            trigger: 'item',
            //formatter: "{a} <br/>{b}: {c}"//{a} <br/>
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          title: {
            text: chartDataTotal,
            //subtext: datasubtext[0],
            x: 'center',
            y: 'center',
            textStyle: {
              fontSize:18,
              fontWeight:'normal',
              color: ['#4563d0']
            }
          },
          grid: {
            left: '0%',
            right: '5%',
            bottom: '0%',
            containLabel: true
          },
          legend: {
            orient: 'vertical',
            right: 40,
            top: 'center',
            align: 'left',
            data: chartData.name,
            padding: [0, 10],
            selectedMode: true,
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            inactiveColor: '#dedede',
            itemGap: 20,
            textStyle: {
              fontSize: 14,
              color: '#77899c',
              width: 80
            },
            tooltip: {
              show: true
            },

          },
          series: [
            {
              name: '摄像机统计',
              type: 'pie',
              radius: ['50%', '70%'],
              //center: ['40%', '50%'],
              avoidLabelOverlap: false,
              //hoverAnimation: false,
              //legendHoverLink: false,
              silent: false,
              label: {
                normal: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              itemStyle: {
                emphasis: {
                  text: chartDataTotal + 10000000,
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                color: function (params) {
                  var colorList = ['#4563d0', '#ff5215', '#cdcdcd'];
                  return colorList[params.dataIndex];
                }
              },
              data: chartData,
            }
          ]
        });
      },

      /**
       * 柱状加载函数
       */
      barChart(id,chartData,chartTitle){
        this.barCharts = this.$echarts.init(document.getElementById(id))
        this.barCharts.setOption(
          {
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            title: {
              left: 'center',
              text: chartTitle,
              textStyle: {
                fontSize:15,
                fontWeight: 'bold'
              }
            },
            xAxis:  {
              type: 'category',
              data: chartData.titles,
              //网格样式
              splitLine: {
                show: true,
                lineStyle:{
                  color: ['rgba(157, 157, 157, 0.3)'],
                  width: 1,
                  type: 'dashed'
                }
              },
            },
            yAxis: {
              type: 'value',
              //网格样式
              splitLine: {
                show: true,
                lineStyle:{
                  color: ['rgba(157, 157, 157, 0.3)'],
                  width: 1,
                  type: 'dashed'
                }
              },
            },

            series: chartData.newData
          }
        );
      },

      /**
       * 获取摄像机状态数据
       */
      queryCameraState(){
        //console.log("this.userInfo=>",this.userInfo);
        this.getDeviceStatistics({dimensionType:'province',data:{regionCode:this.userInfo.regionCode}}).then((res)=>{
          //console.log("res=>",res)

          //组装饼图加载所用数据
          let total       =0,
            offline     =0,
            online      =0,
            inerror     =0,
            offlineList =[],
            onlineList  =[],
            inerrorList =[],
            titles      =[];
          for(var i=0,len=res.data.length;i<len;i++){
            total   += res.data[i].total;
            offline += res.data[i].offline;
            online  += res.data[i].online;
            inerror += res.data[i].inerror;
            offlineList.push(res.data[i].offline);
            onlineList.push(res.data[i].online);
            inerrorList.push(res.data[i].inerror);
            titles.push(res.data[i].name);
          };
          //console.log(offline,online,inerror);
          this.pieChart(
            'abnormal-chart',
            [
              {
                value:online,
                name:'正常',
              },{
              value:offline,
              name:'故障',
            },{
              value:inerror,
              name:'离线',
            }
            ],
            total
          );

          //加载柱状图
          this.queryCityCameraState(onlineList,offlineList,inerrorList,titles);
        })
      },

      /**
       * 获取各省视频运行状态
       */
      queryCityCameraState(online,offline,inerror,titles){
        //console.log("arr=>",online,offline,inerror,titles);
        let newData=[{
          name:'正常',
          type: 'bar',
          stack: '总量',
          barWidth:15,
          itemStyle:{
            emphasis:{
              barBorderRadius:30
            },
            normal:{
              color:'#4563d0',
              barBorderRadius:[0, 0, 0, 0]
            },
          },
          barGap: '-100%',
          data:online
        },{
          name:'故障',
          type: 'bar',
          stack: '总量',
          barWidth:'17%',
          itemStyle:{
            emphasis:{
              barBorderRadius:30
            },
            normal:{
              color:'#ff5215',
              barBorderRadius:[0, 0, 0, 0]
            }
          },
          barGap: '-100%',
          data:offline,
        },{
          name:'离线',
          type: 'bar',
          stack: '总量',
          barWidth:'17%',
          itemStyle:{
            emphasis:{
              barBorderRadius:30
            },
            normal:{
              color:'#cdcdcd',
              barBorderRadius:[0, 0, 0, 0]
            }
          },
          barGap: '-100%',
          data:inerror
        }
        ];

        this.barChart("province-state-chart",{newData,titles},`各省视频运行状态统计(${this.addDate(new Date().getTime(),'-')})`);

      },

      /**
       * 获取当前日期
       * return 年-月-日
       */
      addDate(dateTime,flag) {
        let nowDate = new Date(dateTime);
        let date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate(),
        };
        let systemDate = date.year + flag + (date.month>9?'':0) + date.month + flag + (date.date>9?'':0) + date.date;
        return systemDate;
      },

      /**
       * 加载页面基础数据
       */
      loadBasicData(){
        let dateList        =[],
          newdataList     =[],
          abnormalList    =[],
          nowadays        =new Date().getTime(),
          num             =1000 * 3600 * 24;
        for(let i=14;i>=0;i--){
          dateList.push(this.addDate(nowadays-num*i,'/'));
          if(newdataList.length == 0){
            newdataList[0] =  1200;
          }else{
            newdataList.push(newdataList[newdataList.length-1]+((Math.random()*100).toFixed())*1);
          }
          abnormalList.push((Math.random()*100).toFixed());
        };
        this.insertList=dateList;
        this.insertData=newdataList;
        this.abnormalData=abnormalList;
      },

    }
  }

</script>


<style lang="less">
  .control-box{
    width: 100%;
    height: 100%;

    .container{
      width: 100%;
      height: 100%;

      >div{
        background-color: @white;
        border-radius: 4px;
        border: solid 1px #e6eced;
        height: calc(100% / 3.09);
        width: 100%;
        margin-bottom: 10px;
        padding-top: 15px;
        box-sizing: border-box;

        #chartBox1,#chartBox2{
          width: 100%;
          height: 100%;
        }

        .pie-chart{
          width: 20%;
          height: 100%;
          display: inline-block;

          #abnormal-chart{
            width: 100%;
            height: 100%;
          }
        }

        .bar-chart{
          width: 80%;
          height: 100%;
          display: inline-block;

          #province-state-chart{
            width: 100%;
            height: 100%;
          }
        }

      }
    }


  }

  .tooltip-box{
    background-color: rgba(0, 0, 0, 0.6);
    color: #ffffff;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 15px;
    padding: 0px 12px;
    position: relative;
  }

  .tooltip-box:before{
    display: inline-block;
    content: '';
    width: 0;
    height: 0;
    border: 4px solid rgba(0, 0, 0, 0);
    border-top: 4px solid rgba(0, 0, 0, 0.6);
    position: absolute;
    bottom: -8px;
    left: 0px;
    right: 0px;
    margin: auto;
  }

</style>

