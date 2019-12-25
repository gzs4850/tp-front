<template>
  <div style="width: 100%;">
    <el-card style="margin-top: 20px;">
      <el-form :inline="true">
        <el-form-item >
          <b>定时任务列表</b>
        </el-form-item>
        <el-form-item style="float:right" >
          <el-button type="primary" size="small" @click="urlAdd">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%">
        <el-table-column label="ID" width="50">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.url_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.url_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.url_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="定时器（秒 分 时 日 月 周）">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.qa_url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下次执行时间">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.pro_url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sys_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="urlEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="urlDelete(scope.$index, scope.row)">删除
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
            <el-input v-model="form.url_name" size="small" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" label-width="120px">
            <el-input v-model="form.url_name" size="small" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="内容" label-width="120px">
            <el-input v-model="form.qa_url" size="small" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="任务定时器" label-width="120px">
            <el-input v-model="form.pro_url" size="small" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="项目" prop="project_id" label-width="120px">
            <el-select v-model="form.project_id" @change="onSelectedProDrug($event, form.project_id)" size="small" placeholder="" style="width:100%">
              <el-option v-for="item in proList" :key="item.id" :label="item.pro_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="子系统" prop="system_id" label-width="120px">
            <el-select v-model="form.system_id" @change="onSelectedSysDrug" size="small" placeholder="" style="width:100%">
              <el-option v-for="item in sysList" :key="item.id" :label="item.sys_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="modifyUrl">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { requestAllSystem } from '@/api/system'
import { requestAllProject } from '@/api/project'
import { getBaseurl, addBaseurl, updateBaseurl, delBaseurl } from '@/api/baseurl'
export default {
  name: 'PageSchedule',
  data () {
    return {
      tableData: [],
      proList: [],
      sysList: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogFormVisible: false,
      form: {
        id: '',
        url_name: '',
        qa_url: '',
        pro_url: '',
        system_id: '',
        project_id: '',
        index: 0
      }
    }
  },
  methods: {
    urlQuery () {
      getBaseurl().then(res => {
        this.pageTotal = res.baseurls.length
        this.tableData = res.baseurls
      })
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
    urlAdd () {
      this.form.dialogType = 'add'
      this.form.index = ''
      this.form.url_name = ''
      this.form.qa_url = ''
      this.form.pro_url = ''
      this.form.system_id = ''
      this.form.project_id = ''
      this.dialogFormVisible = true
      this.queryProjectList()
    },
    urlEdit (index, row) {
      this.queryProjectList()
      this.querySystemList(row.project_id)
      this.form.dialogType = 'edit'
      this.form.index = index + (this.currentPage - 1) * this.pageSize
      this.form.id = row.id
      this.form.url_name = row.url_name
      this.form.qa_url = row.qa_url
      this.form.pro_url = row.pro_url
      this.form.system_id = row.system_id
      this.form.project_id = row.project_id
      this.dialogFormVisible = true
    },
    urlDelete (index, row) {
      this.tableData.splice(index + (this.currentPage - 1) * this.pageSize, 1)
      this.pageTotal = this.tableData.length
      delBaseurl(row.id, {}).then(res => {
        this.$message({
          message: '删除' + row.url_name + '成功！',
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
    modifyUrl () {
      console.log('--------form------', this.form)
      this.dialogFormVisible = false
      if (this.form.dialogType === 'add') {
        addBaseurl(this.form).then(res => {
          this.$message({
            message: '新增' + this.form.url_name + '成功！',
            type: 'success'
          })
        })
        this.urlQuery()
      } else {
        updateBaseurl(this.form.id, this.form).then(res => {
          this.tableData[this.form.index].url_name = this.form.url_name
          this.tableData[this.form.index].qa_url = this.form.qa_url
          this.tableData[this.form.index].pro_url = this.form.pro_url
          this.tableData[this.form.index].pro_name = this.form.pro_name
          this.tableData[this.form.index].sys_name = this.form.sys_name
          this.$message({
            message: '修改' + this.form.url_name + '成功！',
            type: 'success'
          })
        })
      }
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
    this.urlQuery()
  }
}
</script>

<style scoped>
</style>
