<template>
  <div style="width: 100%;">
    <el-card style="margin-top: 20px;">
      <el-form :inline="true">
        <el-form-item label="批次号：" prop="batchNumber">
          <el-select v-model="formInline.batchNumber" clearable size="small" placeholder="" style="width:100%">
            <el-option v-for="item in batchNumberList" :key="item.key" :label="item.value"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试结果：" prop="result">
          <el-select v-model="formInline.result" clearable size="small" placeholder="" style="width:100%">
            <el-option v-for="item in resultOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用例名称：" prop="case_name">
          <el-input v-model="formInline.case_name" size="mini" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="resultQuery('formInline')">查询</el-button>
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
              @click="resultDetail(scope.$index, scope.row)">详情
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
      <el-dialog title="测试结果详情" :visible.sync="dialogFormVisible">
        <div style="padding: 20px;margin: -20px;font-size: 14px;">
<!--          <p style="font-weight: bold;text-align: center">调试结果</p>-->
          <p>用例名称：<span>{{resultInfo.case_name}}</span></p>
          <p>
            测试结果：<span v-if="resultInfo.test_result==='pass'" style="color:#00FF00">{{resultInfo.test_result}}</span>
            <span v-else-if="resultInfo.test_result==='fail'" style="color:#FF0000">{{resultInfo.test_result}}</span>
          </p>
          <p>测试时间：<span>{{resultInfo.timestamp}}</span></p>
          <p>测试时间：<span>{{resultInfo.timestamp}}</span></p>
          <p>请求地址：<span>{{resultInfo.real_req_path}}</span></p>
          <p>请求头：<br><span>{{resultInfo.real_req_head}}</span></p>
          <p>请求体：<br><span>{{resultInfo.real_req_json}}</span></p>
          <p>响应头：<br><span>{{resultInfo.real_rsp_head}}</span></p>
          <p>响应体：<br><span>{{resultInfo.real_rsp_json}}</span></p>
          <p>断言结果：<br><span>{{resultInfo.assert_msg}}</span></p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getBatchNumber, getResultlist } from '@/api/testresult'
export default {
  name: 'PageResult',
  data () {
    return {
      tableData: [],
      batchNumberList: [],
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
      resultInfo: {
        case_id: '',
        case_name: '',
        real_rsp_code: '',
        if_name: '',
        sys_name: '',
        pro_name: '',
        test_result: '',
        timestamp: '',
        real_rsp_time: '',
        real_req_path: '',
        real_req_head: '',
        real_req_json: '',
        real_rsp_head: '',
        real_rsp_json: '',
        assert_msg: ''
      }
    }
  },
  methods: {
    batchNumberQuery () {
      getBatchNumber().then(res => {
        for (let index in res.batchnumbers) {
          // console.log('number---', res.batchnumbers[index])
          this.batchNumberList.push({ key: res.batchnumbers[index], value: res.batchnumbers[index] })
        }
        this.formInline.batchNumber = this.batchNumberList[0].value
      })
    },
    resultQuery (formName) {
      getResultlist(this.formInline).then(res => {
        this.pageTotal = res.count
        this.tableData = res.testresults
      })
    },
    handleSizeChange (size) {
      this.pagesize = size
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    resultDetail (index, row) {
      this.resultInfo.index = index + (this.currentPage - 1) * this.pageSize
      this.resultInfo.case_id = row.case_id
      this.resultInfo.case_name = row.case_name
      this.resultInfo.test_result = row.test_result
      this.resultInfo.timestamp = row.timestamp
      this.resultInfo.real_rsp_code = row.real_rsp_code
      this.resultInfo.if_name = row.if_name
      this.resultInfo.sys_name = row.sys_name
      this.resultInfo.pro_name = row.pro_name
      this.resultInfo.real_req_path = row.real_req_path
      this.resultInfo.real_req_head = row.real_req_head
      this.resultInfo.real_req_json = row.real_req_json
      this.resultInfo.real_rsp_head = row.real_rsp_head
      this.resultInfo.real_rsp_json = row.real_rsp_json
      this.resultInfo.assert_msg = row.assert_msg
      this.dialogFormVisible = true
    }
  },
  mounted: function () {
    this.batchNumberQuery()
    this.resultQuery()
  }
}
</script>

<style scoped>
p {
  list-style:none;
  word-break:break-all;
}
</style>
