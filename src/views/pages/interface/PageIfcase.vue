<template>
  <div style="width: 100%;">
    <el-card style="margin-top: 20px;">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :inline="true" :model="formInline" ref="formInline">
            <el-form-item>
              <el-select v-model="formInline.project_id" clearable @change="querySystemList($event, formInline.project_id)" placeholder="项目" style="width:30%">
                <el-option v-for="item in proList" :key="item.id" :label="item.pro_name" :value="item.id"></el-option>
              </el-select>
              <el-select v-model="formInline.sys_id" clearable @change="queryIfList($event, formInline.sys_id)" placeholder="子系统" style="width:30%">
                <el-option v-for="item in sysList" :key="item.id" :label="item.sys_name" :value="item.id"></el-option>
              </el-select>
              <el-select v-model="formInline.if_id" clearable placeholder="接口" style="width:40%">
                <el-option v-for="item in ifList" :key="item.id" :label="item.if_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
            <el-input v-model="formInline.if_name" placeholder="用例名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery('formInline')">查询</el-button>
            </el-form-item>
            <el-form-item style="float:right">
              <el-button type="primary" @click="handleAdd()">新增</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%">
            <el-table-column label="ID">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.case_name }}</span>
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
        </el-col>
        <el-col :span="12">
          <el-form :inline="true" :model="formInfo" ref="formInline">
            <el-form-item label="服务器地址" prop="base_url">
              <el-input v-model="formInfo.base_url" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">调试</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">保存</el-button>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="formInfo.case_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="方法">
              <el-input v-model="formInfo.if_method" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="协议">
              <el-input v-model="formInfo.if" auto-complete="off"></el-input>
            </el-form-item>
            <el-table
              :data="tableCase"
              style="width: 100%">
              <el-table-column label="ID">
                <template slot-scope="scope">
                  <span style="margin-left: 5px">{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="顺序">
                <template slot-scope="scope">
                  <span style="margin-left: 5px">{{ scope.row.case_name }}</span>
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
          </el-form>
        </el-col>

        <el-dialog title="用例信息" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="名称" label-width="120px">
              <el-input v-model="form.case_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="项目" prop="project_id" label-width="120px">
              <el-select v-model="form.pro_name" @change="onSelectedProDrug($event, form.project_id)" placeholder="" style="width:100%">
                <el-option v-for="item in proList" :key="item.id" :label="item.pro_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="子系统" prop="system_id" label-width="120px">
              <el-select v-model="form.sys_name" @change="onSelectedSysDrug($event, form.system_id)" placeholder="" style="width:100%">
                <el-option v-for="item in sysList" :key="item.id" :label="item.sys_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接口" prop="system_id" label-width="120px">
              <el-select v-model="form.if_name" @change="onSelectedIfDrug" placeholder="" style="width:100%">
                <el-option v-for="item in ifList" :key="item.id" :label="item.if_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="路径" label-width="120px">
              <el-input v-model="form.if_url" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="modifyUser()">确 定</el-button>
          </div>
        </el-dialog>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { requestIfcaselist, addIfcase, updateIfcase, delIfcase } from '@/api/ifcase'
import { requestInterface } from '@/api/interface'
import { requestAllProject } from '@/api/project'
import { requestSystemBySearch } from '@/api/system'

export default {
  name: 'PageIfcase',
  data () {
    return {
      formInline: {
        if_name: '',
        project_id: '',
        sys_id: ''
      },
      formInfo: {
        base_url: '',
        case_name: '',
        case_url: ''
      },
      proList: [],
      sysList: [],
      ifList: [],
      tableData: [],
      tableCase: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogFormVisible: false,
      form: {
        id: '',
        case_name: '',
        interface_id: '',
        if_name: '',
        if_url: '',
        project_id: '',
        pro_name: '',
        system_id: '',
        sys_name: '',
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
        this.formInline.sys_id = this.sysList.length > 0 ? this.sysList[0]['id'] : ''
      })
    },
    queryIfList (systemId) {
      requestInterface({ 'system_id': systemId }).then(res => {
        this.ifList = res.interfaces
        this.formInline.if_id = this.ifList.length > 0 ? this.ifList[0]['id'] : ''
      })
    },
    handleQuery (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('formInline----', this.formInline)
          requestIfcaselist(this.formInline).then(res => {
            this.$message({
              message: '查询成功！',
              type: 'success'
            })
            // console.log('projects:', res.projects)
            this.pageTotal = res.testcases.length
            this.tableData = res.testcases
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
      this.form.case_name = ''
      this.form.interface_id = ''
      this.form.if_url = ''
      this.form.project_id = ''
      this.form.system_id = ''
      this.dialogFormVisible = true
    },
    handleEdit (index, row) {
      this.form.dialogType = 'edit'
      this.form.index = index + (this.currentPage - 1) * this.pageSize
      this.form.id = row.id
      this.form.case_name = row.case_name
      this.form.interface_id = row.interface_id
      this.form.if_name = row.if_name
      this.form.if_url = row.url
      this.form.project_id = row.project_id
      this.form.pro_name = row.pro_name
      this.form.system_id = row.system_id
      this.form.sys_name = row.sys_name
      this.dialogFormVisible = true
    },
    handleDelete (index, row) {
      this.tableData.splice(index + (this.currentPage - 1) * this.pageSize, 1)
      this.pageTotal = this.tableData.length
      delIfcase(row.id, {}).then(res => {
        this.$message({
          message: '删除' + row.case_name + '成功！',
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
        addIfcase(this.form).then(res => {
          this.$message({
            message: '新增' + this.form.case_name + '成功！',
            type: 'success'
          })
        })
        this.handleQuery('formInline')
      } else {
        updateIfcase(this.form.id, this.form).then(res => {
          this.tableData[this.form.index].case_name = this.form.case_name
          this.tableData[this.form.index].if_name = this.form.if_name
          this.tableData[this.form.index].pro_name = this.form.pro_name
          this.tableData[this.form.index].sys_name = this.form.sys_name
          this.tableData[this.form.index].if_url = this.form.if_url
          this.$message({
            message: '修改' + this.form.case_name + '成功！',
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
    onSelectedSysDrug (e, systemId) {
      this.queryIfList(systemId)
      let obj = {}
      obj = this.sysList.find((item) => { // 这里的proList就是上面遍历的数据源
        return item.id === e// 筛选出匹配数据
      })
      this.form.sys_name = obj.sys_name
    },
    onSelectedIfDrug (e) {
      let obj = {}
      obj = this.ifList.find((item) => { // 这里的proList就是上面遍历的数据源
        return item.id === e// 筛选出匹配数据
      })
      this.form.if_url = obj.if_url
      this.form.if_name = obj.if_name
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
