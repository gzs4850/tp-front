<template>
  <div style="width: 100%;">
    <el-card style="margin-top: 20px;">
      <el-form :inline="true" :model="formInline" ref="formInline">
        <el-form-item label="子系统名称：" prop="sys_name">
          <el-input v-model="formInline.sys_name" size="mini" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="项目：" prop="project_id">
          <el-select v-model="formInline.project_id" clearable size="mini" placeholder="" style="width:100%">
            <el-option v-for="item in proList" :key="item.id" :label="item.pro_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryBySearch('formInline')">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right" >
          <el-button type="primary" size="mini" @click="systemAdd()">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column label="ID" width="50">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sys_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.pro_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>描述: {{ scope.row.sys_desc }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.sys_desc }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="systemEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="systemDelete(scope.$index, scope.row)">删除
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
      <el-dialog title="子系统信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="名称" label-width="120px">
            <el-input v-model="form.sys_name" size="mini" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="项目" prop="project_id" label-width="120px">
            <el-select v-model="form.project_id" size="mini" placeholder="" @change="onSelectedDrug" style="width:100%">
              <el-option v-for="item in proList" :key="item.id" :label="item.pro_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" label-width="120px">
            <el-input type="textarea" :rows="2" v-model="form.sys_desc" size="mini" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="systemModify">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { requestSystems, addSystem, updateSystem, delSystem } from '@/api/system'
import { requestProjects } from '@/api/project'
export default {
  name: 'PageSystem',
  data () {
    return {
      formInline: {
        sys_name: '',
        project_id: ''
      },
      proList: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogFormVisible: false,
      form: {
        id: '',
        sys_name: '',
        project_id: '',
        sys_desc: '',
        index: 0
      }
    }
  },
  methods: {
    queryBySearch () {
      this.resetCurrentPage()
      this.systemQuery()
    },
    queryProjectList () {
      requestProjects().then(res => {
        this.proList = res.projects
      })
    },
    systemQuery (formName) {
      this.$set(this.formInline, 'currentPage', this.currentPage)
      this.$set(this.formInline, 'pageSize', this.pageSize)
      requestSystems(this.formInline).then(res => {
        // this.$message({
        //   message: '查询成功！',
        //   type: 'success'
        // })
        this.pageTotal = res.count
        this.tableData = res.systems
      })
    },
    systemAdd () {
      this.form.dialogType = 'add'
      this.form.index = ''
      this.form.sys_name = ''
      this.form.project_id = ''
      this.form.sys_desc = ''
      this.dialogFormVisible = true
    },
    systemEdit (index, row) {
      this.form.dialogType = 'edit'
      this.form.index = index + (this.currentPage - 1) * this.pageSize
      this.form.id = row.id
      this.form.sys_name = row.sys_name
      this.form.pro_name = row.pro_name
      this.form.project_id = row.project_id
      this.form.sys_desc = row.sys_desc
      this.dialogFormVisible = true
    },
    systemDelete (index, row) {
      this.tableData.splice(index + (this.currentPage - 1) * this.pageSize, 1)
      this.pageTotal = this.tableData.length
      delSystem(row.id, {}).then(res => {
        this.$message({
          message: '删除' + row.sys_name + '成功！',
          type: 'success'
        })
      })
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.systemQuery()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.systemQuery()
    },
    resetCurrentPage () {
      this.currentPage = 1
    },
    systemModify () {
      this.dialogFormVisible = false
      if (this.form.dialogType === 'add') {
        addSystem({ 'sys_name': this.form.sys_name, 'project_id': this.form.project_id, 'sys_desc': this.form.sys_desc }).then(res => {
          this.$message({
            message: '新增' + this.form.sys_name + '成功！',
            type: 'success'
          })
        })
        this.systemQuery()
      } else {
        updateSystem(this.form.id, { 'sys_name': this.form.sys_name, 'project_id': this.form.project_id, 'sys_desc': this.form.sys_desc }).then(res => {
          this.tableData[this.form.index].sys_name = this.form.sys_name
          this.tableData[this.form.index].sys_desc = this.form.sys_desc
          this.tableData[this.form.index].pro_name = this.form.pro_name
          this.$message({
            message: '修改' + this.form.sys_name + '成功！',
            type: 'success'
          })
        })
      }
    },
    onSelectedDrug (e) {
      let obj = {}
      obj = this.proList.find((item) => { // 这里的proList就是上面遍历的数据源
        return item.id === e// 筛选出匹配数据
      })
      this.form.pro_name = obj.pro_name
      // console.log(obj.pro_name)// 获取的 name
      // console.log(e)// 获取的 id
    }
  },
  mounted: function () {
    this.systemQuery()
    this.queryProjectList()
  }
}
</script>

<style scoped>
</style>
