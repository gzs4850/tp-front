<template>
  <div style="width: 100%;">
    <el-card style="margin-top: 20px;">
      <el-form :inline="true" :model="formInline" ref="formInline">
        <el-form-item label="接口名称" prop="if_name">
          <el-input v-model="formInline.if_name" size="mini" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="项目" prop="project_id">
          <el-select v-model="formInline.project_id" clearable @change="querySystemList($event, formInline.project_id)" size="mini" placeholder=""
                     style="width:100%">
            <el-option v-for="item in proList" :key="item.id" :label="item.pro_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子系统" prop="sys_id">
          <el-select v-model="formInline.sys_id" clearable size="mini" placeholder="" style="width:100%">
            <el-option v-for="item in sysList" :key="item.id" :label="item.sys_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleQuery('formInline')">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" size="mini" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%">
        <el-table-column label="ID" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span>{{ scope.row.if_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="方法" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.if_method }}</span>
          </template>
        </el-table-column>
        <el-table-column label="协议" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.if_protocol }}</span>
          </template>
        </el-table-column>
        <el-table-column label="路径">
          <template slot-scope="scope">
            <span>{{ scope.row.if_url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="子系统">
          <template slot-scope="scope">
            <span>{{ scope.row.sys_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目">
          <template slot-scope="scope">
            <span>{{ scope.row.pro_name }}</span>
          </template>
        </el-table-column>
<!--        <el-table-column label="描述" width="180">-->
<!--          <template slot-scope="scope">-->
<!--            <span style="margin-left: 10px">{{ scope.row.if_desc }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
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
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)">生成用例
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
      <el-dialog title="接口信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="名称" label-width="120px">
            <el-input v-model="form.if_name" size="mini" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="方法" prop="if_method" label-width="120px">
            <el-select v-model="form.if_method" size="mini" placeholder="" style="width:100%">
              <el-option v-for="item in methodList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="协议" prop="if_protocol" label-width="120px">
            <el-select v-model="form.if_protocol" size="mini" placeholder="" style="width:100%">
              <el-option v-for="item in protocolList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路径" label-width="120px">
            <el-input v-model="form.if_url" size="mini" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="项目" prop="project_id" label-width="120px">
            <el-select v-model="form.project_id" @change="querySystemList($event, form.project_id)" size="mini" placeholder="" style="width:100%">
              <el-option v-for="item in proList" :key="item.id" :label="item.pro_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="子系统" prop="system_id" label-width="120px">
            <el-select v-model="form.system_id" @change="onSelectedSysDrug" size="mini" placeholder="" style="width:100%">
              <el-option v-for="item in sysList" :key="item.id" :label="item.sys_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" label-width="120px">
            <el-input type="textarea" :rows="2" v-model="form.if_desc" size="mini" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="modifyInterface">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { requestInterface, addInterface, updateInterface, delInterface } from '@/api/interface'
import { requestAllProject } from '@/api/project'
import { requestSystemBySearch } from '@/api/system'

export default {
  name: 'PageInterface',
  data () {
    return {
      formInline: {
        if_name: '',
        project_id: '',
        sys_id: ''
      },
      methodList: [{
        value: 'GET',
        label: 'GET'
      }, {
        value: 'POST',
        label: 'POST'
      }, {
        value: 'PUT',
        label: 'PUT'
      }, {
        value: 'DELETE',
        label: 'DELETE'
      }],
      protocolList: [{
        value: 'HTTP',
        label: 'HTTP'
      }, {
        value: 'DUBBO',
        label: 'DUBBO'
      }],
      proList: [],
      sysList: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogFormVisible: false,
      form: {
        id: '',
        if_name: '',
        if_method: '',
        if_protocol: '',
        if_url: '',
        project_id: '',
        system_id: '',
        if_desc: '',
        index: 0
      }
    }
  },
  methods: {
    queryProjectList () {
      requestAllProject().then(res => {
        this.proList = res.projects
      })
    },
    querySystemList (projectId) {
      requestSystemBySearch({ 'project_id': projectId }).then(res => {
        this.sysList = res.systems
        if (this.sysList.length > 0) {
          this.formInline.sys_id = ''
        }
        // this.formInline.sys_id = this.sysList.length > 0 ? this.sysList[0]['id'] : ''
      })
    },
    handleQuery (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('formInline----', this.formInline)
          requestInterface(this.formInline).then(res => {
            this.$message({
              message: '查询成功！',
              type: 'success'
            })
            // console.log('projects:', res.projects)
            this.pageTotal = res.interfaces.length
            this.tableData = res.interfaces
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAdd () {
      this.form.dialogType = 'add'
      this.form.index = ''
      this.form.if_name = ''
      this.form.if_method = ''
      this.form.if_protocol = 'HTTP'
      this.form.if_url = ''
      this.form.project_id = ''
      this.form.system_id = ''
      this.form.if_desc = ''
      this.dialogFormVisible = true
    },
    handleEdit (index, row) {
      this.form.dialogType = 'edit'
      this.form.index = index + (this.currentPage - 1) * this.pageSize
      this.form.id = row.id
      this.form.if_name = row.if_name
      this.form.if_method = row.if_method
      this.form.if_protocol = row.if_protocol
      this.form.if_url = row.if_url
      this.form.pro_name = row.pro_name
      this.form.project_id = row.project_id
      this.form.sys_name = row.sys_name
      this.form.system_id = row.system_id
      this.form.if_desc = row.if_desc
      this.dialogFormVisible = true
    },
    handleDelete (index, row) {
      this.tableData.splice(index + (this.currentPage - 1) * this.pageSize, 1)
      this.pageTotal = this.tableData.length
      delInterface(row.id, {}).then(res => {
        this.$message({
          message: '删除' + row.if_name + '成功！',
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
    modifyInterface () {
      this.dialogFormVisible = false
      if (this.form.dialogType === 'add') {
        addInterface(this.form).then(res => {
          this.$message({
            message: '新增' + this.form.if_name + '成功！',
            type: 'success'
          })
        })
        this.handleQuery('formInline')
      } else {
        updateInterface(this.form.id, this.form).then(res => {
          this.tableData[this.form.index].if_name = this.form.if_name
          this.tableData[this.form.index].if_method = this.form.if_method
          this.tableData[this.form.index].if_protocol = this.form.if_protocol
          this.tableData[this.form.index].if_url = this.form.if_url
          this.tableData[this.form.index].pro_name = this.form.pro_name
          this.tableData[this.form.index].sys_name = this.form.sys_name
          this.tableData[this.form.index].if_desc = this.form.if_desc
          this.$message({
            message: '修改' + this.form.if_name + '成功！',
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
    this.handleQuery('formInline')
    this.queryProjectList()
  }
}
</script>

<style scoped>
</style>
