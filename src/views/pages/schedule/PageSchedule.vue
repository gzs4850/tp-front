<template>
  <div style="width: 100%;">
    <el-card style="margin-top: 20px;">
      <el-form :inline="true">
        <el-form-item >
          <b>定时任务列表</b>
        </el-form-item>
        <el-form-item style="float:right" >
          <el-button type="primary" size="small" @click="jobAdd">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%">
        <el-table-column label="任务名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行对象">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.project_name }}{{ scope.row.system_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="定时器（秒 分 时 日 月 周）">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cron }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下次执行时间">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.next_run_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="jobPause(scope.$index, scope.row)"
              :disabled="scope.row.status === 'running'?false:true">暂停
            </el-button>
            <el-button
              size="mini"
              type="success"
              @click="jobResume(scope.$index, scope.row)"
              :disabled="scope.row.status === 'running'?true:false">恢复
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="jobEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="jobDelete(scope.$index, scope.row)">删除
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
            <el-input v-model="form.id" size="small" auto-complete="off"></el-input>
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
import { requestAllSystem } from '@/api/system'
import { requestAllProject } from '@/api/project'
import { jobPause, jobResume, jobRemove, jobEdit, jobAdd, jobGet } from '@/api/schedule'
export default {
  name: 'PageSchedule',
  data () {
    return {
      tableData: [],
      proList: [],
      sysList: [],
      envOptions: [{
        value: 'uat',
        label: '测试环境'
      }, {
        value: 'dev',
        label: '开发环境'
      }],
      typeOptions: [{
        value: 'apitest',
        label: '接口测试'
      }, {
        value: 'uitest',
        label: 'WEB测试'
      }],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogFormVisible: false,
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
    jobQuery () {
      jobGet().then(res => {
        this.pageTotal = res.jobs.length
        this.tableData = res.jobs
      })
    },
    jobPause (index, row) {
      jobPause({ id: row.id }).then(res => {
        this.$message({
          message: '暂定' + row.id + '成功！',
          type: 'success'
        })
      })
      this.jobQuery()
    },
    jobResume (index, row) {
      jobResume({ id: row.id }).then(res => {
        this.$message({
          message: '恢复' + row.id + '成功！',
          type: 'success'
        })
      })
      this.jobQuery()
    },
    queryProjectList () {
      requestAllProject().then(res => {
        this.proList = res.projects
      })
    },
    querySystemList (projectId) {
      requestAllSystem({ 'project_id': projectId }).then(res => {
        this.sysList = res.systems
        if (this.sysList.length === 0) {
          this.form.system_id = ''
        }
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
    jobDelete (index, row) {
      this.tableData.splice(index + (this.currentPage - 1) * this.pageSize, 1)
      this.pageTotal = this.tableData.length
      jobRemove({ id: row.id }).then(res => {
        this.$message({
          message: '删除' + row.id + '成功！',
          type: 'success'
        })
      })
    },
    handleSizeChange (size) {
      this.pagesize = size
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    modifyJob () {
      this.dialogFormVisible = false
      if (this.form.dialogType === 'add') {
        jobAdd(this.form).then(res => {
          this.$message({
            message: '新增' + this.form.id + '成功！',
            type: 'success'
          })
        })
      } else {
        console.log('--------form------', this.form)
        jobEdit(this.form).then(res => {
          this.tableData[this.form.index].id = this.form.id
          this.tableData[this.form.index].job_type = this.form.job_type
          this.tableData[this.form.index].cron = this.form.cron
          this.tableData[this.form.index].env = this.form.env
          this.tableData[this.form.index].pro_name = this.form.pro_name
          this.tableData[this.form.index].sys_name = this.form.sys_name
          this.$message({
            message: '修改' + this.form.id + '成功！',
            type: 'success'
          })
        })
      }
      this.jobQuery()
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
    this.jobQuery()
  }
}
</script>

<style scoped>
</style>
