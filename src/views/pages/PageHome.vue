<template>
  <div class="m-home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="el-icon-set-up" style="color: #F56C6C;"></i>
          </div>
          <div class="m-content">
            <p>项目数</p>
            <p class="m-count">{{ projectTotal }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="el-icon-message" style="color: #E6A23C;"></i>
          </div>
          <div class="m-content">
            <p>子系统数</p>
            <p class="m-count">{{ systemTotal }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="el-icon-cpu" style="color: #67C23A;"></i>
          </div>
          <div class="m-content">
            <p>接口数</p>
            <p class="m-count">{{ interfaceTotal }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="el-icon-document" style="color: #c28c2c;"></i>
          </div>
          <div class="m-content">
            <p>接口用例数</p>
            <p class="m-count">{{ ifcaseTotal }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="24" :lg="6">
        <el-row :gutter="20" align>
          <el-col :sm="12" :lg="24">
            <el-card class="m-box-card" shadow="hover" style="height: 90px;">
              <div slot="header">
                <p style="text-align: center">
                  <i class="el-icon-info" style="margin-right: 10px"></i>
                  <span>最近一次测试结果</span>
                </p>
                <div style="padding-top: 5px;font-size: 14px;">
                  <p>
                    <span style="color:#0000FF">总数：{{ lastResInfo.total }}</span>
                    <span style="margin-left: 10px; color:#00FF00">成功：{{ lastResInfo.pass }}</span>
                    <span style="margin-left: 10px; color:#FF0000">失败：{{ lastResInfo.fail }}</span>
                  </p>
                  <p>执行时间：{{ lastResInfo.time }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :sm="12" :lg="24">
            <el-card class="m-box-card" shadow="hover">
              <ve-pie :data="chartData2" :settings="chartSettings2" height="310px"></ve-pie>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :sm="24" :lg="18">
        <el-card class="m-box-card" shadow="hover">
          <ve-line :data="chartData1" :settings="chartSettings1" :extend="extend"></ve-line>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { requestAllProject } from '@/api/project'
import { requestAllSystem } from '@/api/system'
import { requestInterface } from '@/api/interface'
import { requestIfcaselist } from '@/api/ifcase'
import { getResultStatistic } from '@/api/testresult'
import VeLine from 'v-charts/lib/line.common'
import VePie from 'v-charts/lib/pie.common'
import 'echarts/lib/component/title'

export default {
  name: 'PageHome',
  components: {
    VePie,
    VeLine
  },
  data () {
    return {
      projectTotal: '',
      systemTotal: '',
      interfaceTotal: '',
      ifcaseTotal: '',
      resultStatisticTotal: '',
      resultStatistic: [],
      extend: {
        series: {
          label: {
            normal: {
              show: true
            }
          }
        }
      },
      chartData1: {
        columns: ['time', 'pass', 'fail', 'rate'],
        rows: []
      },
      chartSettings1: {
        labelMap: {
          pass: '成功用例数',
          fail: '失败用例数',
          rate: '成功率'
        },
        axisSite: { right: ['rate'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['用例数', '比率']
      },
      chartData2: {
        columns: ['类别', '数量'],
        rows: []
      },
      chartSettings2: {
        dimension: '类别',
        metrics: '数量'
      },
      lastResInfo: {}
    }
  },
  methods: {
    queryProjects () {
      requestAllProject().then(res => {
        this.projectTotal = res.projects.length
        this.tableProject = res.projects
      })
    },
    querySystems () {
      requestAllSystem().then(res => {
        this.systemTotal = res.systems.length
        this.tableSystem = res.systems
      })
    },
    queryInterfaces () {
      requestInterface().then(res => {
        this.interfaceTotal = res.interfaces.length
        this.tableInterface = res.interfaces
      })
    },
    queryIfcases () {
      requestIfcaselist().then(res => {
        this.ifcaseTotal = res.testcases.length
        this.tableIfcase = res.testcases
      })
    },
    queryResultStatistic () {
      getResultStatistic().then(res => {
        this.resultStatisticTotal = res.testresult.length
        this.resultStatistic = res.testresult
        this.chartData1.rows = this.resultStatistic
        this.chartData2.rows = [
          { '类别': '成功', '数量': this.resultStatistic[0].pass },
          { '类别': '失败', '数量': this.resultStatistic[0].fail }
        ]
        this.lastResInfo = {
          'time': this.resultStatistic[0].time,
          'total': this.resultStatistic[0].total,
          'pass': this.resultStatistic[0].pass,
          'fail': this.resultStatistic[0].fail
        }
        // console.log('resultStatistic----', this.resultStatistic)
      })
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    }
  },
  mounted () {
    this.queryProjects()
    this.querySystems()
    this.queryInterfaces()
    this.queryIfcases()
    this.queryResultStatistic()
  }
}
</script>

<style scoped lang="scss">
.m-home {
  .m-box-card {
    margin-bottom: 10px;
    color: #666666;

    .m-icon {
      float: left;
      width: 60px;

      i {
        font-size: 40px;
      }
    }

    .m-content {
      margin-left: 60px;

      .m-count {
        font-size: 20px;
      }
    }
  }

  .m-task-box {
    margin-bottom: 20px;

    .m-task-text {
      float: left;
      line-height: 16px;
    }

    .m-task-pro {
      margin-left: 60px;
    }
  }
}
</style>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
