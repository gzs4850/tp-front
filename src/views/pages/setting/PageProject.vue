<template>
  <div style="width: 100%;">
    <el-card style="margin-top: 20px;">
      <el-form :inline="true" :model="formInline" ref="formInline" :rules="rules">
        <el-form-item label="项目：" prop="id">
          <el-input v-model="formInline.id" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('formInline')">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right" >
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%">
        <el-table-column label="ID">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>描述: {{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.address }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
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
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="120px">
            <el-input type="textarea" :rows="2" v-model="form.address" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyUser()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-duplicates
// import { requestProject } from '@/api/project'
// eslint-disable-next-line import/no-duplicates
import { requestAllProject } from '@/api/project'
export default {
  name: 'PageProject',
  data () {
    return {
      formInline: {
        id: ''
      },
      tableData: [
      ],
      rules: {
        param1: [
          { required: true, message: '请输入', trigger: 'blur' }
          // { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        param2: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogFormVisible: false,
      form: {
        name: '',
        date: '',
        address: '',
        index: 0
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          requestAllProject().then(res => {
            this.$message({
              message: '查询成功！',
              type: 'success'
            })
            // this.pageTotal = res.data.length
            // this.tableData = res.data
            console.log('----------------', res.data)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAdd (index, row) {
      this.form.dialogType = 'add'
      this.form.index = ''
      this.form.name = ''
      this.form.date = ''
      this.form.address = ''
      this.dialogFormVisible = true
    },
    handleEdit (index, row) {
      this.form.dialogType = 'edit'
      this.form.index = index + (this.currentPage - 1) * this.pageSize
      this.form.name = row.name
      this.form.date = row.date
      this.form.address = row.address
      this.dialogFormVisible = true
    },
    handleDelete (index, row) {
      this.tableData.splice(index + (this.currentPage - 1) * this.pageSize, 1)
      this.pageTotal = this.tableData.length
      this.$message({
        message: '删除' + row.name + '成功！',
        type: 'success'
      })
    },
    handleSizeChange (size) {
      this.pagesize = size
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    modifyUser () {
      this.tableData[this.form.index].name = this.form.name
      this.tableData[this.form.index].date = this.form.date
      this.tableData[this.form.index].address = this.form.address
      this.dialogFormVisible = false
      if (this.form.dialogType === 'add') {
        this.$message({
          message: '新增' + this.form.name + '成功！',
          type: 'success'
        })
      } else {
        this.$message({
          message: '修改' + this.form.name + '成功！',
          type: 'success'
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
