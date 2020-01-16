<template>
  <div style="width: 100%;">
    <el-card style="margin-top: 20px;">
      <el-form :inline="true" :model="formInline" ref="formInline" :rules="rules">
        <el-form-item label="项目名称：" prop="pro_name">
          <el-input v-model="formInline.pro_name" size="mini" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryBySearch('formInline')">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right" >
          <el-button type="primary" size="mini" @click="projectAdd">新增</el-button>
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
            <span style="margin-left: 10px">{{ scope.row.pro_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>描述: {{ scope.row.pro_desc }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.pro_desc }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="projectEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="projectDelete(scope.$index, scope.row)">删除
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
      <el-dialog title="项目信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="名称" label-width="120px">
            <el-input v-model="form.pro_name" size="mini" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="120px">
            <el-input type="textarea" :rows="2" v-model="form.pro_desc" size="mini" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="projectModify">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { requestProjects, addProject, updateProject, delProject } from '@/api/project'
export default {
  name: 'PageProject',
  data () {
    return {
      formInline: {
        pro_name: ''
      },
      tableData: [
      ],
      rules: {
        pro_name: [
          // { required: true, message: '请输入', trigger: 'blur' },
          // { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ]
      },
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogFormVisible: false,
      form: {
        id: '',
        pro_name: '',
        pro_desc: '',
        index: 0
      }
    }
  },
  methods: {
    queryBySearch () {
      this.resetCurrentPage()
      this.projectQuery()
    },
    projectQuery (formName) {
      this.$set(this.formInline, 'currentPage', this.currentPage)
      this.$set(this.formInline, 'pageSize', this.pageSize)
      // this.$refs[formName].validate((valid) => {
      //   // console.log('pro_name:', this.formInline.pro_name)
      //   if (valid) {
      requestProjects(this.formInline).then(res => {
        this.$message({
          message: '查询成功！',
          type: 'success'
        })
        this.pageTotal = res.count
        this.tableData = res.projects
      })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    projectAdd () {
      this.form.dialogType = 'add'
      this.form.index = ''
      this.form.pro_name = ''
      this.form.pro_desc = ''
      this.dialogFormVisible = true
    },
    projectEdit (index, row) {
      this.form.dialogType = 'edit'
      this.form.index = index + (this.currentPage - 1) * this.pageSize
      this.form.id = row.id
      this.form.pro_name = row.pro_name
      this.form.pro_desc = row.pro_desc
      this.dialogFormVisible = true
    },
    projectDelete (index, row) {
      this.tableData.splice(index + (this.currentPage - 1) * this.pageSize, 1)
      this.pageTotal = this.tableData.length
      delProject(row.id, {}).then(res => {
        this.$message({
          message: '删除' + row.pro_name + '成功！',
          type: 'success'
        })
      })
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.projectQuery()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.projectQuery()
    },
    resetCurrentPage () {
      this.currentPage = 1
    },
    projectModify () {
      this.dialogFormVisible = false
      if (this.form.dialogType === 'add') {
        addProject({ 'pro_name': this.form.pro_name, 'pro_desc': this.form.pro_desc }).then(res => {
          this.$message({
            message: '新增' + this.form.pro_name + '成功！',
            type: 'success'
          })
        })
        this.queryAll()
      } else {
        updateProject(this.form.id, { 'pro_name': this.form.pro_name, 'pro_desc': this.form.pro_desc }).then(res => {
          this.tableData[this.form.index].pro_name = this.form.pro_name
          this.tableData[this.form.index].pro_desc = this.form.pro_desc
          this.$message({
            message: '修改' + this.form.pro_name + '成功！',
            type: 'success'
          })
        })
      }
    }
  },
  mounted: function () {
    this.projectQuery()
  }
}
</script>

<style scoped>
</style>
