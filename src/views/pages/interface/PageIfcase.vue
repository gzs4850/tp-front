<template>
  <div style="width: 100%;">
    <el-card style="margin-top: 20px;">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form :inline="true" :model="formInline" ref="formInline">
            <el-row>
              <el-col :span="8">
                <el-form-item>
                  <el-select v-model="formInline.project_id" clearable size="small"
                             @change="querySystemList($event, formInline.project_id)" placeholder="项目">
                    <el-option v-for="item in proList" :key="item.id" :label="item.pro_name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-select v-model="formInline.sys_id" clearable size="small"
                             @change="queryIfList($event, formInline.sys_id)"
                             placeholder="子系统">
                    <el-option v-for="item in sysList" :key="item.id" :label="item.sys_name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-select v-model="formInline.if_id" clearable size="small" placeholder="接口">
                    <el-option v-for="item in ifList" :key="item.id" :label="item.if_name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item>
                  <el-input v-model="formInline.if_name" size="small" placeholder="用例名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button type="primary" size="mini" @click="caseQuery('formInline')">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="caseAdd">新增</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            @row-click="openDetails" stripe style="width: 100%">
            <el-table-column label="ID" width="50">
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
                  @click="caseEdit(scope.$index, scope.row)">编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="caseDelete(scope.$index, scope.row)">删除
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
        <el-col :span="10">
          <el-form :inline="true" :model="baseInfo" ref="formInline" :disabled="able">
            <el-row>
              <el-form-item label="名称" prop="case_name">
                <el-input v-model="baseInfo.case_name" size="small" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="URL" prop="case_url">
                <el-input v-model="baseInfo.url" size="small" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item style="float:right">
                <el-button type="primary" size="mini" @click="save">保存</el-button>
              </el-form-item>
            </el-row>
          </el-form>

          <el-button type="primary" size="mini" @click="refAdd" :disabled="able">添加依赖</el-button>

          <el-table
            :data="tableCaseref"
            style="width: 100%">
            <el-table-column label="顺序">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.ordernum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="依赖ID">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.refer_mockid }}</span>
              </template>
            </el-table-column>
            <el-table-column label="依赖名称">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.refer_casename }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="refDelete(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-tabs>
            <el-tab-pane label="自定义变量" :disabled="able">
              <el-button type="primary" size="mini" @click="variableAdd" :disabled="able">添加变量</el-button>
              <el-button type="primary" size="mini" @click="variableDelete" :disabled="able">删除变量</el-button>
              <el-table
                :data="tableVariable"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="键">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.key"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="值">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.value"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="请求头设置" :disabled="able">
              <el-button type="primary" size="mini" @click="headerAdd">添加请求头</el-button>
              <el-button type="primary" size="mini" @click="headerDelete">删除请求头</el-button>
              <el-table
                :data="tableHeader"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="字段">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.key"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="值">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.value"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="字段提取" :disabled="able">
              <el-button type="primary" size="mini" @click="extractAdd">提取字段</el-button>
              <el-button type="primary" size="mini" @click="extractDelete">删除提取</el-button>
              <el-table
                :data="tableExtract"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <!--            <el-table-column-->
                <!--              align="center"-->
                <!--              label="用例名称">-->
                <!--              <template slot-scope="scope">-->
                <!--                <el-select v-model="scope.row.case_id" placeholder="请选择" size="small">-->
                <!--                  <el-option-->
                <!--                    v-for="item in tableCaseref"-->
                <!--                    :key="item.refer_mockid"-->
                <!--                    :label="item.refer_casename"-->
                <!--                    :value="item.refer_mockid">-->
                <!--                  </el-option>-->
                <!--                </el-select>-->
                <!--              </template>-->
                <!--            </el-table-column>-->
                <el-table-column
                  align="center"
                  label="提取对象">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.extract_obj" placeholder="请选择" size="small">
                      <el-option
                        v-for="item in extractOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="变量名">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.var_name"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="提取表达式">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.var_express"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="断言设置" :disabled="able">
              <el-button type="primary" size="mini" @click="assertAdd">添加断言</el-button>
              <el-button type="primary" size="mini" @click="assertDelete">删除断言</el-button>
              <el-table
                :data="tableAssert"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="断言变量">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.var_express" placeholder="请选择" size="small">
                      <el-option
                        v-for="item in tableExtract"
                        :key="item.var_express"
                        :label="item.var_name"
                        :value="item.var_express">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="期望值">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.var_expect"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="Json" name="first" :disabled="able">
              <el-input
                type="textarea"
                :rows="10"
                placeholder="请输入JSON格式数据"
                v-model="reqjson">
              </el-input>
            </el-tab-pane>
            <el-tab-pane label="Parameters" name="second" :disabled="able">
              <el-button type="primary" size="mini" @click="parameterAdd">添加参数</el-button>
              <el-button type="primary" size="mini" @click="parameterDelete">删除参数</el-button>
              <el-table
                :data="tableParameter"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="名称">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.key"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="值">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.value"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Files Upload" name="third" :disabled="able">
              <el-button type="primary" size="mini" @click="fileAdd">添加文件</el-button>
              <el-button type="primary" size="mini" @click="fileDelete">删除文件</el-button>
              <el-table
                :data="tableFile"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="文件名称">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.key"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="参数名称">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.value"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="MIME类型">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      placeholder=""
                      v-model="scope.row.type"
                      clearable>
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="7">
          <el-form :inline="true" :model="resultInfo" ref="formInline" :disabled="able">
            <el-row>
              <el-form-item label="环境" prop="base_url">
                <el-select v-model="resultInfo.base_url" size="small" placeholder="">
                  <el-option v-for="item in envOptions" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="float:right">
                <el-button type="primary" size="mini" @click="run">调试</el-button>
              </el-form-item>
            </el-row>
          </el-form>
          <div style="padding: 20px;margin: -20px;font-size: 14px;">
              <p style="font-weight: bold;text-align: center">调试结果</p>
              <p>用例名称：<span>{{resultInfo.case_name}}</span></p>
              <p>
                测试结果：<span v-if="resultInfo.test_result==='pass'" style="color:#00FF00">{{resultInfo.test_result}}</span>
                <span v-else-if="resultInfo.test_result==='fail'" style="color:#FF0000">{{resultInfo.test_result}}</span>
              </p>
              <p>测试时间：<span>{{resultInfo.timestamp}}</span></p>
              <p>测试时间：<span>{{resultInfo.timestamp}}</span></p>
              <p>请求地址：<br><span>{{resultInfo.real_req_path}}</span></p>
              <p>请求头：<br><span>{{resultInfo.real_req_head}}</span></p>
              <p>请求体：<br><span>{{resultInfo.real_req_json}}</span></p>
              <p>响应头：<br><span>{{resultInfo.real_rsp_head}}</span></p>
              <p>响应体：<br><span>{{resultInfo.real_rsp_json}}</span></p>
              <p>断言结果：<br><span>{{resultInfo.assert_msg}}</span></p>
          </div>
        </el-col>
        <el-dialog title="用例信息" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="名称" label-width="120px">
              <el-input v-model="form.case_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="项目" prop="project_id" label-width="120px">
              <el-select v-model="form.project_id" @change="onSelectedProDrug($event, form.project_id)" placeholder=""
                         style="width:100%">
                <el-option v-for="item in proList" :key="item.id" :label="item.pro_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="子系统" prop="system_id" label-width="120px">
              <el-select v-model="form.system_id" @change="onSelectedSysDrug($event, form.system_id)" placeholder=""
                         style="width:100%">
                <el-option v-for="item in sysList" :key="item.id" :label="item.sys_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接口" prop="system_id" label-width="120px">
              <el-select v-model="form.interface_id" @change="onSelectedIfDrug" placeholder="" style="width:100%">
                <el-option v-for="item in ifList" :key="item.id" :label="item.if_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="路径" label-width="120px">
              <el-input v-model="form.if_url" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="方法" label-width="120px">
              <el-input v-model="form.method" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="modifyCase" size="mini">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="用例关联添加" :visible.sync="dialogCaseref">
          <el-form :inline="true" :model="searchInfo" ref="formInline">
            <el-form-item style="width:60%">
              <el-input v-model="searchInfo.searchName" placeholder="用例名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            :data="tableCaseList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
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
            <el-table-column label="接口">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.if_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="系统">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.sys_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.pro_name }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCaseref = false" size="mini">取 消</el-button>
            <el-button type="primary" size="mini" @click="modifyRef()">确 定</el-button>
          </div>
        </el-dialog>

      </el-row>
    </el-card>
  </div>
</template>

<script>
import {
  requestIfcaselist,
  getIfcase,
  addIfcase,
  updateIfcase,
  delIfcase,
  getRefercase,
  delRefercase,
  addRefercase,
  runIfcase
} from '@/api/ifcase'
import { getResult } from '@/api/testresult'
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
      proList: [],
      sysList: [],
      ifList: [],
      caseList: [],
      tableData: [],
      tableCaseList: [],
      tableVariable: [],
      tableHeader: [{
        key: 'Content-Type',
        value: 'application/json'
      }],
      tableExtract: [],
      deleteIds: [],
      extractOptions: [{
        value: 'header',
        label: '响应头'
      }, {
        value: 'content',
        label: '响应体'
      }],
      envOptions: [{
        value: 'uat',
        label: '测试环境'
      }, {
        value: 'dev',
        label: '开发环境'
      }],
      tableAssert: [],
      currentCaseId: '',
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogFormVisible: false,
      dialogCaseref: false,
      dialogHeader: false,
      dialogResultVisible: false,
      form: {
        id: '',
        case_name: '',
        method: '',
        interface_id: '',
        if_name: '',
        if_url: '',
        project_id: '',
        pro_name: '',
        system_id: '',
        sys_name: '',
        index: 0,
        var_json: {},
        request_head: {},
        extract_json: {},
        check_json: {},
        request_json: {}
      },
      baseInfo: {
        id: '',
        method: '',
        case_name: '',
        url: ''
      },
      tableCaseref: [],
      refForm: {
        id: '',
        mockid: '',
        ordernum: '',
        refer_mockid: '',
        refer_casename: ''
      },
      searchInfo: {
        searchName: ''
      },
      activeName: 'first',
      reqjson: '',
      tableParameter: [],
      tableFile: [],
      caseInfo: {
        case_name: '',
        if_url: '',
        method: '',
        var_json: {},
        request_head: {},
        extract_json: {},
        check_json: {},
        request_json: {}
      },
      resultInfo: {
        base_url: '',
        case_name: '',
        test_result: '',
        timestamp: '',
        real_rsp_time: '',
        real_rsp_code: '',
        real_req_path: '',
        real_req_head: '',
        real_req_json: '',
        real_rsp_head: '',
        real_rsp_json: '',
        assert_msg: ''
      },
      able: true
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
        this.formInline.if_id = ''
        // this.formInline.if_id = this.ifList.length > 0 ? this.ifList[0]['id'] : ''
      })
    },
    queryCaseList () {
      requestIfcaselist({}).then(res => {
        this.tableCaseList = res.testcases
      })
    },
    openDetails (row) {
      getIfcase(row.id, {}).then(res => {
        this.baseInfo = res.testcases[0]
        console.log('this.baseInfo-----', this.baseInfo)
        this.tableVariable = []
        this.tableHeader = []
        this.tableAssert = []
        this.tableExtract = []
        this.reqjson = JSON.stringify(this.baseInfo.request_json)
        if (this.baseInfo.var_json) {
          for (let [key, val] of Object.entries(this.baseInfo.var_json)) {
            this.tableVariable.push({ key: key, value: val })
          }
        }
        if (this.baseInfo.request_head) {
          for (let [key, val] of Object.entries(this.baseInfo.request_head)) {
            this.tableHeader.push({ key: key, value: val })
          }
        }
        if (this.baseInfo.extract_json) {
          for (let [key, val] of Object.entries(this.baseInfo.extract_json)) {
            let str1 = val.slice(0, val.indexOf('.'))
            let str2 = val.slice(val.indexOf('.') + 1)
            this.tableExtract.push({ var_name: key, extract_obj: str1, var_express: str2 })
          }
        }
        if (this.baseInfo.check_json) {
          for (let [key, val] of Object.entries(this.baseInfo.check_json)) {
            // console.log('key,val', key, val)
            let str1 = key.slice(0, key.indexOf('.'))
            let str2 = key.slice(key.indexOf('.') + 1)
            this.tableAssert.push({ var_obj: str1, var_expect: val, var_express: str2 })
          }
        }
      })
      this.getReflist(row.id)
      this.toDisable()
      this.queryResult(row.id)
    },
    toDisable () {
      console.log('this.baseInfo.id----', this.baseInfo.id)
      if (this.baseInfo) {
        this.able = false
      } else {
        this.able = true
      }
    },
    save () {
      this.caseInfo.var_json = {}
      this.caseInfo.request_head = {}
      this.caseInfo.extract_json = {}
      this.caseInfo.check_json = {}
      this.caseInfo.case_name = this.baseInfo.case_name
      this.caseInfo.if_url = this.baseInfo.url
      this.caseInfo.method = this.baseInfo.method
      if (this.tableVariable) {
        for (let i in this.tableVariable) {
          this.caseInfo.var_json[this.tableVariable[i].key] = this.tableVariable[i].value
        }
      }
      if (this.tableHeader) {
        for (let i in this.tableHeader) {
          this.caseInfo.request_head[this.tableHeader[i].key] = this.tableHeader[i].value
        }
      }
      if (this.tableExtract) {
        for (let i in this.tableExtract) {
          this.caseInfo.extract_json[this.tableExtract[i].var_name] = this.tableExtract[i].extract_obj + '.' + this.tableExtract[i].var_express
        }
      }
      if (this.tableAssert) {
        for (let i in this.tableAssert) {
          for (let j in this.tableExtract) {
            if (this.tableExtract[j].var_express === this.tableAssert[i].var_express) {
              this.tableAssert[i].var_obj = this.tableExtract[j].extract_obj
            }
          }
          this.caseInfo.check_json[this.tableAssert[i].var_obj + '.' + this.tableAssert[i].var_express] = this.tableAssert[i].var_expect
        }
      }
      if (this.reqjson) {
        this.caseInfo.request_json = JSON.parse(this.reqjson)
      } else {
        if (this.tableParameter) {
          for (let i in this.tableParameter) {
            // console.log('i:', this.tableParameter[i].key, this.tableParameter[i].value)
            this.caseInfo.request_json[this.tableParameter[i].key] = this.tableParameter[i].value
          }
        }
      }
      updateIfcase(this.baseInfo.id, this.caseInfo).then(res => {
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
      })
    },
    run () {
      if (this.resultInfo.base_url) {
        runIfcase(this.baseInfo.id, { 'env': this.resultInfo.base_url }).then(res => {
          this.$message({
            message: '运行成功！',
            type: 'success'
          })
        })
      } else {
        this.$message.error('请选择调试环境！')
      }
      this.queryResult(this.baseInfo.id)
    },
    queryResult (caseId) {
      getResult(caseId, {}).then(res => {
        this.resultInfo = res.testresult
        this.resultInfo.case_name = this.baseInfo.case_name
      })
      // this.dialogResultVisible = true
    },
    getReflist (caseId) {
      getRefercase(caseId).then(res => {
        this.tableCaseref = res.caserefers
        this.currentCaseId = this.tableCaseref.mockid
        // console.log('------------', this.tableCaseref)
      })
    },
    caseQuery (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          requestIfcaselist(this.formInline).then(res => {
            this.pageTotal = res.testcases.length
            this.tableData = res.testcases
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    caseAdd () {
      this.form.dialogType = 'add'
      this.form.index = ''
      this.form.case_name = ''
      this.form.method = ''
      this.form.interface_id = ''
      this.form.if_url = ''
      this.form.project_id = ''
      this.form.system_id = ''
      this.dialogFormVisible = true
    },
    caseEdit (index, row) {
      this.form.dialogType = 'edit'
      this.form.index = index + (this.currentPage - 1) * this.pageSize
      this.form.id = row.id
      this.form.method = row.method
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
    caseDelete (index, row) {
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
    modifyCase () {
      this.dialogFormVisible = false
      console.log('********form***********', this.form)
      if (this.form.dialogType === 'add') {
        addIfcase(this.form).then(res => {
          this.$message({
            message: '新增' + this.form.case_name + '成功！',
            type: 'success'
          })
        })
        this.caseQuery('formInline')
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
      obj = this.sysList.find((item) => { // 这里的sysList就是上面遍历的数据源
        return item.id === e// 筛选出匹配数据
      })
      this.form.sys_name = obj.sys_name
    },
    onSelectedIfDrug (e) {
      let obj = {}
      obj = this.ifList.find((item) => { // 这里的ifList就是上面遍历的数据源
        return item.id === e// 筛选出匹配数据
      })
      this.form.if_url = obj.if_url
      this.form.if_name = obj.if_name
      this.form.method = obj.if_method
    },
    refAdd () {
      this.queryCaseList()
      this.searchInfo.id = this.tableCaseref.mockid
      this.searchInfo.searchName = ''
      this.dialogCaseref = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log('**************', this.multipleSelection)
    },
    modifyRef () {
      this.dialogCaseref = false
      if (this.multipleSelection) {
        addRefercase(this.baseInfo.id, this.multipleSelection).then(res => {
          this.$message({
            message: '新增用例依赖成功！',
            type: 'success'
          })
        })
      }
      this.getReflist(this.baseInfo.id)
    },
    refDelete (index, row) {
      this.tableCaseref.splice(index, 1)
      delRefercase(row.id, {}).then(res => {
        this.$message({
          message: '删除' + row.refer_casename + '成功！',
          type: 'success'
        })
      })
    },
    variableAdd () {
      this.tableVariable.push({
        key: null,
        value: null
      })
    },
    variableDelete () {
      if (this.multipleSelection) {
        this.multipleSelection.forEach(element => {
          if (element.id && this.deleteIds.indexOf(element.id) === -1) {
            this.deleteIds.push(element.id)
          }
          this.tableVariable.splice(this.tableVariable.indexOf(element), 1)
          this.$message({
            message: '删除请求头成功！',
            type: 'success'
          })
        })
      } else {
        this.$message.error('请选择需删除的列！')
      }
    },
    headerAdd () {
      this.tableHeader.push({
        key: null,
        value: null
      })
    },
    headerDelete () {
      if (this.multipleSelection) {
        this.multipleSelection.forEach(element => {
          if (element.id && this.deleteIds.indexOf(element.id) === -1) {
            this.deleteIds.push(element.id)
          }
          this.tableHeader.splice(this.tableHeader.indexOf(element), 1)
          this.$message({
            message: '删除请求头成功！',
            type: 'success'
          })
        })
      } else {
        this.$message.error('请选择需删除的列！')
      }
    },
    extractAdd () {
      this.tableExtract.push({
        extract_obj: null,
        var_name: null,
        var_express: null
      })
    },
    extractDelete () {
      if (this.multipleSelection) {
        this.multipleSelection.forEach(element => {
          if (element.id && this.deleteIds.indexOf(element.id) === -1) {
            this.deleteIds.push(element.id)
          }
          this.tableExtract.splice(this.tableExtract.indexOf(element), 1)
        })
      }
    },
    assertAdd () {
      this.tableAssert.push({
        var_obj: null,
        var_express: null,
        var_expect: null
      })
    },
    assertDelete () {
      if (this.multipleSelection) {
        this.multipleSelection.forEach(element => {
          if (element.id && this.deleteIds.indexOf(element.id) === -1) {
            this.deleteIds.push(element.id)
          }
          this.tableAssert.splice(this.tableAssert.indexOf(element), 1)
        })
      }
    },
    tabClick (tab, event) {
      console.log(tab, event)
    },
    parameterAdd () {
      this.tableParameter.push({
        key: null,
        value: null
      })
    },
    parameterDelete () {
      if (this.multipleSelection) {
        this.multipleSelection.forEach(element => {
          if (element.id && this.deleteIds.indexOf(element.id) === -1) {
            this.deleteIds.push(element.id)
          }
          this.tableParameter.splice(this.tableParameter.indexOf(element), 1)
        })
      } else {
        this.$message.error('请选择需删除的列！')
      }
    },
    fileAdd () {
      this.tableFile.push({
        key: null,
        value: null,
        type: null
      })
    },
    fileDelete () {
      if (this.multipleSelection) {
        this.multipleSelection.forEach(element => {
          if (element.id && this.deleteIds.indexOf(element.id) === -1) {
            this.deleteIds.push(element.id)
          }
          this.tableFile.splice(this.tableFile.indexOf(element), 1)
        })
      } else {
        this.$message.error('请选择需删除的列！')
      }
    }
  },
  mounted: function () {
    this.caseQuery('formInline')
    this.queryProjectList()
  }
}
</script>

<style scoped>
p {
  list-style:none;
  word-break:break-all;
}
</style>
