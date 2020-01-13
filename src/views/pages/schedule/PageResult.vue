<template>
  <div style="width: 100%;">
    <el-card style="margin-top: 20px;">
      <el-form :inline="true">
        <el-form-item label="批次号：" prop="batchNumber">
          <el-select v-model="formInline.batchNumber" clearable @change="querySystemList($event, formInline.project_id)" size="mini" placeholder=""
                     style="width:100%">
          </el-select>
        </el-form-item>
        <el-form-item label="测试结果：" prop="result">
          <el-select v-model="formInline.result" size="small" placeholder="请选择结果" style="width:100%">
            <el-option v-for="item in resultOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用例名称：" prop="case_name">
          <el-input v-model="formInline.case_name" size="mini" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item style="float:right" >
          <el-button type="primary" size="small" @click="resultQuery">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%">
        <el-table-column label="用例ID">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.case_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用例名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.case_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="测试结果">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.test_result }}</span>
          </template>
        </el-table-column>
        <el-table-column label="响应耗时">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.real_rsp_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行时间">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.timestamp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="resultDetail(scope.$index, scope.row)">查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
      <el-dialog title="定时任务信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="任务名称" label-width="120px">
            <el-input v-model="form.id" size="small" auto-complete="off" :disabled="form.dialogType === 'edit'"></el-input>
          </el-form-item>
          <el-form-item label="任务类型" label-width="120px">
            <el-select v-model="form.job_type" size="small" placeholder="请选择任务类型" style="width:100%">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" label-width="120px">
            <el-select v-model="form.env" size="small" placeholder="请选择环境" style="width:100%">
              <el-option v-for="item in envOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执行对象" label-width="120px">
            <el-select v-model="form.project_id" @change="onSelectedProDrug($event, form.project_id)" size="small" placeholder="请选择项目" style="width:100%">
              <el-option v-for="item in proList" :key="item.id" :label="item.pro_name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="form.system_id" @change="onSelectedSysDrug" size="small" placeholder="请选择系统" style="width:100%">
              <el-option v-for="item in sysList" :key="item.id" :label="item.sys_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务定时器" label-width="120px">
            <el-input v-model="form.cron" size="small" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="modifyJob">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getBatchNumber, getResultlist } from '@/api/testresult'
// import { requestAllProject } from '@/api/project'
// import { jobPause, jobResume, jobRemove, jobEdit, jobAdd, jobGet } from '@/api/schedule'
export default {
  name: 'PageResult',
  data () {
    return {
      tableData: [],
      batchNumberList: [],
      proList: [],
      sysList: [],
      resultOptions: [{
        value: 'pass',
        label: '成功'
      }, {
        value: 'fail',
        label: '失败'
      }],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogFormVisible: false,
      formInline: {
        batchNumber: '',
        case_name: '',
        result: ''
      },
      form: {
        id: '',
        job_type: '',
        env: '',
        cron: '',
        system_id: '',
        project_id: '',
        index: 0
      }
    }
  },
  methods: {
    batchNumberQuery () {
      getBatchNumber().then(res => {
        this.batchNumberList = res.batchnumbers
      })
    },
    resultQuery () {
      getResultlist().then(res => {
        this.pageTotal = res.testresults.length
        this.tableData = res.testresults
      })
    },
    jobAdd () {
      this.form.dialogType = 'add'
      this.form.index = ''
      this.form.id = ''
      this.form.job_type = ''
      this.form.env = ''
      this.form.cron = ''
      this.form.system_id = ''
      this.form.project_id = ''
      this.dialogFormVisible = true
      this.queryProjectList()
    },
    jobEdit (index, row) {
      this.queryProjectList()
      this.querySystemList(row.project_id)
      this.form.dialogType = 'edit'
      this.form.index = index + (this.currentPage - 1) * this.pageSize
      this.form.id = row.id
      this.form.env = row.env
      this.form.job_type = row.job_type
      this.form.cron = row.cron
      this.form.system_id = row.system_id
      this.form.project_id = row.project_id
      this.dialogFormVisible = true
      console.log('--------form------', this.form)
    },
    onSelectedProDrug (e, projectId) {
      this.querySystemList(projectId)
      let obj = {}
      obj = this.proList.find((item) => { // 这里的proList就是上面遍历的数据源
        return item.id === e// 筛选出匹配数据
      })
      this.form.pro_name = obj.pro_name
    },
    onSelectedSysDrug (e) {
      let obj = {}
      obj = this.sysList.find((item) => { // 这里的proList就是上面遍历的数据源
        return item.id === e// 筛选出匹配数据
      })
      this.form.sys_name = obj.sys_name
    }
  },
  mounted: function () {
    this.batchNumberQuery()
    this.resultQuery()
  }
}
</script>

<style scoped>
</style>
