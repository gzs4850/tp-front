<template>
  <div style="width: 100%;">
    <el-card style="margin-top: 20px;">
      <el-form :inline="true" :model="formInline" ref="formInline" :rules="rules">
        <el-form-item label="子系统名称：" prop="sys_name">
          <el-input v-model="formInline.sys_name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="项目：" prop="pro_id">
          <el-select v-model="formInline.pro_id" placeholder="" style="width:100%">
            <Option v-for="item in proList" :value="item.id" :key="item.id">{{ item.pro_name }}</Option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery('formInline')">查询</el-button>
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
      <el-dialog title="子系统信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="名称" label-width="120px">
            <el-input v-model="form.sys_name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="项目：" prop="pro_id" label-width="120px">
            <el-select v-model="form.pro_name" placeholder="" style="width:100%">
              <Option v-for="item in proList" :value="item.id" :key="item.id">{{ item.pro_name }}</Option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" label-width="120px">
            <el-input type="textarea" :rows="2" v-model="form.sys_desc" auto-complete="off"></el-input>
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
import { requestAllSystem, requestSystemByName, addSystem, updateSystem, delSystem } from '@/api/system'
import { requestAllProject } from '@/api/project'
export default {
  name: 'PageSystem',
  data () {
    return {
      formInline: {
        sys_name: '',
        pro_id: ''
      },
      proList: [
      ],
      pro_id: '',
      tableData: [
      ],
      rules: {
        sys_name: [
          // { required: true, message: '请输入', trigger: 'blur' },
          // { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ]
      },
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogFormVisible: false,
      form: {
        sys_name: '',
        pro_id: '',
        sys_desc: '',
        index: 0
      }
    }
  },
  methods: {
    queryAll () {
      requestAllSystem().then(res => {
        this.pageTotal = res.systems.length
        this.tableData = res.systems
      })
    },
    handleQuery (formName) {
      this.$refs[formName].validate((valid) => {
        console.log('sys_name:', this.formInline.sys_name)
        console.log('pro_name:', this.formInline.pro_name)
        if (valid) {
          if (this.formInline.sys_name == null || this.formInline.sys_name === '') {
            this.queryAll()
          } else {
            requestSystemByName(this.formInline.sys_name).then(res => {
              this.$message({
                message: '查询成功！',
                type: 'success'
              })
              // console.log('projects:', res.projects)
              this.pageTotal = res.systems.length
              this.tableData = [res.systems]
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAdd () {
      this.form.dialogType = 'add'
      this.form.index = ''
      this.form.sys_name = ''
      this.form.pro_name = ''
      this.form.sys_desc = ''
      this.dialogFormVisible = true
    },
    handleEdit (index, row) {
      this.form.dialogType = 'edit'
      this.form.index = index + (this.currentPage - 1) * this.pageSize
      this.form.sys_name = row.sys_name
      this.form.pro_name = row.pro_name
      this.form.sys_desc = row.sys_desc
      this.dialogFormVisible = true
    },
    handleDelete (index, row) {
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
      this.pagesize = size
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    modifyUser () {
      this.dialogFormVisible = false
      if (this.form.dialogType === 'add') {
        addSystem({ 'sys_name': this.form.sys_name, 'pro_name': this.form.pro_name, 'sys_desc': this.form.sys_desc }).then(res => {
          this.$message({
            message: '新增' + this.form.sys_name + '成功！',
            type: 'success'
          })
        })
        this.queryAll()
      } else {
        updateSystem(this.form.index, { 'sys_name': this.form.sys_name, 'pro_name': this.form.pro_name, 'sys_desc': this.form.sys_desc }).then(res => {
          this.tableData[this.form.index].sys_name = this.form.sys_name
          this.tableData[this.form.index].sys_desc = this.form.sys_desc
          this.$message({
            message: '修改' + this.form.sys_name + '成功！',
            type: 'success'
          })
        })
      }
    },
    queryProjectList () {
      requestAllProject().then(res => {
        this.proList = res.projects
        console.log('prolist:', this.proList)
      })
    }
  },
  mounted: function () {
    this.queryAll()
    this.queryProjectList()
  }
}
</script>

<style scoped>
</style>
