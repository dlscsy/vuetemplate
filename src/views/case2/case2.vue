/**
* @Description: 2、主页面表格，弹出form表单，表单中包括单选框，多选框，Switch 开关，并加表单验证
* @Author 张雪
* @Date 2020/3/11
*/
<template>
  <el-row style="background-color: white; height: 87vh; padding: 20px 24px 8px">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker v-model="queryParam.data.operatetime" type="date" placeholder="选择日期" style="width:160px;" />
      </el-form-item>
      <el-form-item label="套餐编码">
        <el-input v-model="queryParam.data.mealcode" placeholder="套餐编码" clearable style="width:160px;" />
      </el-form-item>
      <el-form-item label="套餐类型">
        <el-select v-model="queryParam.data.mealtype" clearable filterable placeholder="请选择" @focus="loadMeal">
          <el-option
            v-for="item in mealoptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button style="min-width:98px" type="primary" @click="queryPage">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button style="min-width:98px" type="primary" @click="addGroup">新建</el-button>
      </el-form-item>
      <el-form-item>
        <el-button style="min-width:98px" type="primary" @click="deleteGroup">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-scrollbar style="height: 70vh">
      <el-table
        :data="tableData"
        border
        style="width: 100%; margin-top: 20px"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" label="选择" width="55" />
        <el-table-column
          prop="mealCode"
          label="套餐编码"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="mealName"
          :show-overflow-tooltip="true"
          label="套餐名称"
          align="center"
        />
        <el-table-column
          prop="effectiveDate"
          :show-overflow-tooltip="true"
          label="生效时间"
          align="center"
          :formatter="dateFormat"
        />
        <el-table-column
          prop="expiryDate"
          :show-overflow-tooltip="true"
          label="失效时间"
          align="center"
          :formatter="dateFormat"
        />
        <el-table-column
          prop="mealType"
          :show-overflow-tooltip="true"
          label="套餐类型"
          align="left"
        >
          <template slot-scope="scope">
            {{ scope.row.mealType | typeFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
            {{ scope.row.status | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-tooltip content="删除" placement="top">
              <el-button size="mini" type="danger" style="margin-left: 3px" icon="el-icon-delete" title="删除" @click="deleteGroup" />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button size="mini" type="primary" style="margin-left: 3px" icon="el-icon-edit" @click="updateGroup(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-footer>
      <el-pagination
        :current-page="queryParam.pageInfo.pageNum"
        :page-sizes="[10, 20,30,50]"
        :page-size="queryParam.pageInfo.pageSize"
        :total="queryParam.pageInfo.size"
        layout="total, sizes, prev ,pager, next, jumper"
        style="margin-top: 15px;text-align: center;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>
    <el-dialog
      title="新建"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="22%">
        <el-form-item label="套餐编码" prop="mealCode">
          <el-input v-model="ruleForm.mealCode" placeholder="请输入套餐编码" style="width:40%" />
        </el-form-item>
        <el-form-item label="套餐名称" prop="mealName">
          <el-input v-model="ruleForm.mealName" placeholder="请输入套餐名称" style="width:40%" />
        </el-form-item>
        <el-form-item label="套餐周期" prop="effectiveDate">
          <el-date-picker
            v-model="ruleForm.effectiveDate"
            type="daterange"
            range-separator="至"
            start-placeholder="生效时间"
            end-placeholder="失效时间"
          />
        </el-form-item>
        <el-form-item label="套餐类型-单选" prop="mealType">
          <el-radio-group v-model="ruleForm.mealType">
            <el-radio-button
              v-for="item in mealoptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否生效" prop="status">
          <el-switch
            v-model="ruleForm.status"
            active-color="#13ce66"
            inactive-color="#C0CCDA"
          />
        </el-form-item>
        <el-form-item label="套餐类型-多选" prop="mealTypeCheck">
          <el-checkbox v-model="ruleForm.checkAll" :indeterminate="ruleForm.isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="ruleForm.mealTypeCheck" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in mealoptions" :key="item.value" :label="item.value">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="权限-下拉树" prop="selectTree">
          <!--下拉树-->
          <tree-select
            :data="ruleForm.selectTreeList"
            :default-props="ruleForm.defaultProps"
            :node-key="ruleForm.nodeKey"
            :checked-keys="ruleForm.defaultCheckedKeys"
            multiple
            @popoverHide="popoverHide"
            @change="changeSelectedNodes"
          /> <!--multiple 控制是否可以多选-->
        </el-form-item>

        <el-form-item>
          <span style="margin-left: 30px">
            <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
            <el-button @click="resetForm('ruleForm')">关闭</el-button>
          </span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>

</template>
<script>
let that
import api from '../../api/case2/case2'
// 日期转换引入fecha
import * as fecha from 'element-ui/lib/utils/date'
// import下拉树组件
import TreeSelect from '../../components/case1/tree-select.vue'
const reg = /[^\a-\z\A-\Z0-9_，,。、\u4E00-\u9FA5]/g
// 定义下拉树数据
var menus = [
  {
    'menuId': 1,
    'menuName': '系统管理',
    'childrenList': [
      {
        'menuId': 100,
        'menuName': '用户管理',
        'childrenList': [
          {
            'menuId': 1000,
            'menuName': '用户查询'
          },
          {
            'menuId': 1001,
            'menuName': '用户新增'
          },
          {
            'menuId': 1002,
            'menuName': '用户修改'
          },
          {
            'menuId': 1003,
            'menuName': '用户删除'
          }
        ]
      },
      {
        'menuId': 101,
        'menuName': '角色管理',
        'childrenList': [
          {
            'menuId': 1006,
            'menuName': '角色查询'
          },
          {
            'menuId': 1007,
            'menuName': '角色新增'
          },
          {
            'menuId': 1008,
            'menuName': '角色修改'
          },
          {
            'menuId': 1011,
            'menuName': '删除角色'
          }
        ]
      }
    ]
  }
]
// 存储下拉树 选中数据
let selectTreeCheckIds

export default {
  components: { TreeSelect }, // 定义组件
  filters: {
    statusFilter: function(value) {
      if (value === '1') {
        return '生效'
      } else if (value === '0') {
        return '失效'
      }
    },
    typeFilter: function(value) {
      //
      const index = that.mealoptions.findIndex(meal => meal.value === value)
      if (that.mealoptions[index]) {
        return that.mealoptions[index].name
      }
    }
  },
  data() {
    return {
      ruleForm: {
        guid: '',
        mealCode: '',
        mealName: '',
        effectiveDate: [], // 日期范围数据
        mealType: '', // 存储单选数据
        status: true,
        mealTypeCheck: [], // 存储 单选框数据
        checkAll: false, // 复选框控制全选
        isIndeterminate: false, // 复选框使用
        mealoptions: [], // 存储复选框数据
        /* ---下拉树 begin--- */
        selectTreeList: menus, // 存储下拉树数据
        defaultProps: { // 默认属性
          children: 'childrenList', // 子节点  可根据需求定义
          label: 'menuName' //  显示内容 可根据需求定义
        },
        nodeKey: 'menuId', // 节点 ，可根据需求定义
        defaultCheckedKeys: [] // 初始化默认值
        /* ---下拉树 end--- */
      },
      baMealItem: {
        guid: '',
        mealCode: '',
        mealName: '',
        mealType: '',
        status: '',
        operatetime: '',
        effectiveDate: '',
        expiryDate: ''
      },
      mealoptions: [], // 套餐类型
      tableChecked: [], // 选中的表格行数据
      tableData: [], // 表格展示的数据
      guids: [], // 批量删除的id组
      dialogVisible: false, // 控制新增、修改显示
      queryParam: {
        data: {
          operatetime: '',
          mealcode: '',
          mealtype: '',
          type: ''
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
          size: 0,
          startRow: 0,
          endRow: 0,
          pages: 0,
          prePage: 0,
          nextPage: 0,
          isFirstPage: true,
          isLastPage: true,
          hasPreviousPage: false,
          navigatePages: 0,
          navigatepageNums: [],
          navigateFirstPage: 1,
          navigateLastPage: 1,
          total: 0
        }
      },
      rules: {
        mealName: [
          { required: true, message: '请输入套餐名称', trigger: 'blur' },
          { min: 0, max: 30, message: '长度为 0 到 30 个字符', trigger: 'blur' }
        ],
        mealCode: [
          { required: true, message: '请填写套餐编码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度为 6 个字符', trigger: 'blur' }
        ],
        mealType: [
          { required: true, message: '请选择套餐类型', trigger: 'blur' }
        ],
        effectiveDate: [
          { required: true, message: '请选择套餐周期', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择套餐状态', trigger: 'blur' }
        ],
        mealTypeCheck: [
          { required: true, message: '请选择套餐类型', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() { // 挂载 html加载完成后执行。执行顺序：子组件-父组件
    // 加载套餐数据
    this.loadMeal()
    // 给下拉树设置初始值
    this.ruleForm.defaultCheckedKeys = [1001]
  },
  beforeCreate: function() { // 创建前
    that = this
  },
  created() { // html加载完成之前，执行。执行顺序：父组件-子组件
    this.queryPage()
  },
  methods: {
    // 点击select，加载套餐类型数据
    loadMeal() {
      this.queryParam.type = 'TC' // 传输套餐类型type=‘TC’
      if (this.mealoptions.length !== 0) {
        return
      }
      api.queryMeal(this.queryParam).then(data => {
        this.mealoptions = data.list
        this.ruleForm.mealoptions = []
        that.mealoptions.forEach(meal => {
          this.ruleForm.mealoptions.push(meal.value)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 日期格式转换
    dateFormat(row, column, cellValue) {
      return cellValue ? fecha.format(new Date(cellValue), 'yyyy-MM-dd') : ''
    },
    /* --- 复选框 begin --- */
    // 全选
    handleCheckAllChange(val) {
      this.ruleForm.mealTypeCheck = val ? this.ruleForm.mealoptions : []
      this.ruleForm.isIndeterminate = false
    },
    // 全不选
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.ruleForm.checkAll = checkedCount === this.mealoptions.length
      this.ruleForm.isIndeterminate = checkedCount > 0 && checkedCount < this.mealoptions.length
    },
    /* --- 复选框 end --- */

    /* --- 下拉树 begin --- */
    // 改变默认选中的节点数据
    initChecked() {
      this.ruleForm.defaultCheckedKeys = [1006, 1007]
    },
    popoverHide(checkedIds, checkedData) {
      console.log(checkedIds)
      console.log(checkedData)
    },
    changeSelectedNodes(selectedData) {
      console.log(selectedData)
      selectTreeCheckIds = selectedData
    },
    /*  --- 下拉树 end --- */

    // 查询全部
    queryPage() { // 根据条件查询出所有的数据
      if (this.queryParam.data.mealcode !== null && this.queryParam.data.mealcode !== '') {
        if (reg.test(this.queryParam.data.mealcode)) {
          this.$message({
            message: '套餐编码不能输入特殊字符',
            type: 'warning',
            duration: 2000
          })
          return false
        }
        if (this.queryParam.data.mealcode.length > 6) {
          this.$message({
            message: '套餐编码长度不能超过6个字符',
            type: 'warning',
            duration: 2000
          })
          return false
        }
      }

      this.baMealItem.mealCode = this.queryParam.data.mealcode
      this.baMealItem.mealType = this.queryParam.data.mealtype
      this.baMealItem.operatetime = this.queryParam.data.operatetime

      api.queryPage(this.baMealItem).then(data => {
        this.tableData = data.list
        this.queryParam.pageInfo.size = data.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 确认添加
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.baMealItem.guid = this.ruleForm.guid
          this.baMealItem.mealCode = this.ruleForm.mealCode
          this.baMealItem.mealName = this.ruleForm.mealName
          const index = that.mealoptions.findIndex(meal => meal.name === this.ruleForm.mealType)
          if (that.mealoptions[index]) {
            this.baMealItem.mealType = that.mealoptions[index].value// 单选框取值
          }
          this.baMealItem.effectiveDate = this.ruleForm.effectiveDate[0] // 日期范围控件
          this.baMealItem.expiryDate = this.ruleForm.effectiveDate[1] // 日期范围控件
          if (this.ruleForm.status === true) {
            this.baMealItem.status = '1' //  Switch 开关 需要转码
          } else {
            this.baMealItem.status = '0' //  Switch 开关 需要转码
          }

          console.log(this.ruleForm.mealTypeCheck) // 复选框取值，数组

          console.log(selectTreeCheckIds) // 下拉树取值 - id

          debugger
          if (this.ruleForm.guid === null || this.ruleForm.guid === '') {
            // 添加
            api.addGroup(this.baMealItem).then(data => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
            }).catch(err => {
              console.log(err)
            })
          } else {
            // 修改
            api.updateGroup(this.baMealItem).then(data => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
            }).catch(err => {
              console.log(err)
            })
          }

          this.dialogVisible = false
          setTimeout(() => {
            this.queryParam.data.operatetime = null
            this.queryParam.data.mealcode = ''
            this.queryParam.data.mealtype = ''
            this.queryPage()
          }, 1000)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭模态框
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    // 修改模态框显示
    updateGroup(row) {
      this.ruleForm.guid = row.guid
      this.ruleForm.mealCode = row.mealCode
      this.ruleForm.mealName = row.mealName
      this.ruleForm.effectiveDate = []
      this.ruleForm.effectiveDate.push(row.effectiveDate)
      this.ruleForm.effectiveDate.push(row.expiryDate)
      const index = that.mealoptions.findIndex(meal => meal.value === row.mealType)
      if (that.mealoptions[index]) {
        this.ruleForm.mealType = that.mealoptions[index].name
      }
      if (row.status === '1') {
        this.ruleForm.status = true
      } else {
        this.ruleForm.status = false
      }
      this.dialogVisible = true
    },
    // 添加模态框显示
    addGroup() { // 新增
      this.ruleForm.guid = ''
      this.ruleForm.mealCode = ''
      this.ruleForm.mealName = ''
      this.ruleForm.effectiveDate = null
      this.ruleForm.mealType = that.mealoptions[0].name
      this.dialogVisible = true
    },
    // 删除
    deleteGroup() { // 批量删除
      if (this.guids === null || this.guids.length === 0) {
        this.$message({
          message: '请至少选择一条数据',
          type: 'warning',
          duration: 2000
        })
        return false
      }
      this.$confirm('你确定要删除吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        api.deleteGroup(this.guids).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.guids = []
          setTimeout(() => {
            this.queryParam.data.mealcode = ''
            this.queryPage()
          }, 1000)
        }).catch(err => {
          console.log(err)
        })
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 选中序列框
    handleSelectionChange(val) { // 批量删除
      this.tableChecked = val
      const ObjDefaultValue = {
        guid: '' // 关联id
      }
      this.tableChecked.forEach(obj => {
        ObjDefaultValue.guid = obj.guid
        this.guids.push(ObjDefaultValue)
      })
    },
    // 点击选中整行数据
    handleRowClick(row) {
      this.itemName = row.itemName
      this.guid = row.guid
    },
    // 每页数据改变时
    handleSizeChange(val) {
      this.queryParam.pageInfo.pageSize = val
      this.queryPage(this.queryParam)
    },
    // 页数改变时
    handleCurrentChange(val) {
      this.queryParam.pageInfo.pageNum = val
      this.queryPage(this.queryParam)
    }
  }
}
</script>
<style scoped>
  .el-input--medium {
    width: 300px;
  }
  .el-select>.el-input {
    width: 300px;
  }
  .el-dialog__title {
    margin-left: 40% !important;
  }
</style>
