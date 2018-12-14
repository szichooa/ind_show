<template>
    <div id="myChart" style="width:1000px;height:500px"></div>
</template>

<script>
import Echarts from 'echarts';
    export default {
        data () {
            return {
                props: ['dataObj'],
                option:{
					title: {
						x: '60',
						y: '20',
						backgroundColor: 'rgba(0,0,0,0)',
						borderColor: '#ccc',       // 标题边框颜色
						borderWidth: 0,            // 标题边框线宽，单位px，默认为0（无边框）
						padding: 5,                // 标题内边距，单位px，默认各方向内边距为5，
						itemGap: 10,               // 主副标题纵向间隔，单位px，默认为10，
						textStyle: {
							fontSize: 18,
							fontWeight: 'bolder',
							color: '#ff6666'          // 主标题文字颜色
						},
						text: '数据曲线图'
					},
					color: ['#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
							'#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0'],
					tooltip : { 
                        trigger: 'axis',
                        axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }},
					legend: {
						x: 'center',
						y: '30',
						borderColor: '#6699FF',//边框颜色
						textStyle: {
							color: '#1e90ff'          // 图例文字颜色
						},
						data:['']
					},
					xAxis: {
                        type: 'category',
                        axisTick: {show: false},
                        data: [],
                        name:'',
                        boundaryGap : false
					},
					yAxis: {},
					series: [ {
                        name: 'Forest',
                        type: 'bar',
                        data: [320, 332, 301, 334, 390]
                    },
                    {
                        name: 'Steppe',
                        type: 'bar',
                        data: [220, 182, 191, 234, 290]
                    },
                    {
                        name: 'Desert',
                        type: 'bar',
                        data: [150, 232, 201, 154, 190]
                    },
                    {
                        name: 'Wetland',
                        type: 'bar',
                        data: [98, 77, 101, 99, 40]
                    }],
                    grid:{
                        x:80,
                        y:80,
                        x2:80,
                        y2:50,
                    }
                },
            }
        },
        mounted() {
            this.initChart();
        },
        methods: {
            initChart() {
                var tableShowDataH=this.$store.state.tableShowData1
                this.option.series=tableShowDataH.datas.map(item=>{
                    return {
                        name:item.key,
                        type: 'line',
                        areaStyle: {},
                        data: item.values
                        
                    }
                })
                this.option.xAxis.data=Array.from({length:tableShowDataH.datas[0].values.length}, (v,k) => k);
                this.option.color= this.option.color.reverse()
                var myChart=document.getElementById('myChart')
                var mainChart = Echarts.init(myChart)
                mainChart.setOption(this.option, true)
            }
        },
         beforeDestroy() {
            if (!this.chart) { return }
            this.chart.dispose();
            this.chart = null;
        }
      
    }
</script>
<style lang="scss" scoped>
    #myChart{
        margin:0 auto;
        background: #fff;
    }
</style>
