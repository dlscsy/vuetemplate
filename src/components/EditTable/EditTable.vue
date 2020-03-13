<template>
  <div class="tableDate">
    <el-row>
      <el-col :span="24">
        <el-table v-loading="tableLoading" size="mini" :data="tableData.data" border style="width: 100%" highlight-current-row>
          <el-table-column type="index" />
          <el-table-column v-for="(v,i) in tableData.columns" :prop="v.field" :label="v.title" :width="v.width">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-date-picker
                  v-if="v.type==='date'"
                  v-model="tableData.sel[v.field]"
                  type="date"
                  value-format="yyyy-MM-dd"
                  size="mini"
                  style="width: 130px"
                  placeholder="选择日期"
                />
                <el-input v-else v-model="tableData.sel[v.field]" size="mini" placeholder="请输入内容" />
              </span>
              <span v-else>{{ scope.row[v.field] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.isSet" class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="saveData(scope.row,scope.$index)">
                保存
              </span>
              <span v-else class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="changeData(scope.row,scope.$index)">
                修改
              </span>
              <span v-if="!scope.row.isSet" class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="delData(scope.row,scope.$index)">
                删除
              </span>
              <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="clearData(scope.row,scope.$index)">
                取消
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <div class="el-table-add-row" style="width: 99.2%;" @click="addRow()"><span>+ 添加</span></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 可以生成唯一id
import uuidv1 from 'uuid/v1'
export default {
  name: 'EditTable',
  props: {
    tableLoading: {
      type: Boolean,
      required: true
    },
    itableData: {
      type: Array,
      required: true
    },
    icolumns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      tableData: {
        sel: null, // 选中行
        columns: this.icolumns,
        data: this.itableData
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 加载表格数据
    loadData() {
      // 给数据添加是否编辑标识
      this.tableData.data.map(i => {
        // if (i.id === null) {
        //   i.id = uuidv1()
        // }
        i.isSet = false // 给后台返回数据添加`isSet`标识
        return i
      })
    },
    // 添加数据
    addRow() {
      for (const i of this.tableData.data) {
        if (i.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      // 构造空行数据结构
      const j = { id: null, 'isSet': true }
      for (var i in this.tableData.columns) {
        j[this.tableData.columns[i].field] = ''
      }
      this.tableData.data.push(j)
      this.tableData.sel = JSON.parse(JSON.stringify(j))
    },
    // 修改
    changeData(row, index) {
      // 点击修改 判断是否已经保存所有操作
      for (const i of this.tableData.data) {
        if (i.isSet) {
          this.$message.warning('请先保存当前编辑项')
          return
        }
      }
      this.tableData.sel = JSON.parse(JSON.stringify(row))
      row.isSet = true
      // vue无法对数组数据的改变进行监听,如果改变数组数据内容需要用一下方式触发更新
      this.tableData.data.splice(index, 1, row)
    },
    // 保存
    saveData(row, index) {
      const data = JSON.parse(JSON.stringify(this.tableData.sel))
      for (const k in data) {
        row[k] = data[k]
      }
      this.$message({
        type: 'success',
        message: '保存成功!'
      })
      row.isSet = false
      this.tableData.data.splice(index, 1, row)
      if (row.id === null) {
        this.$emit('add', row)
      } else {
        this.$emit('edit', row)
      }
    },
    // 取消修改
    clearData(row, index) {
      this.tableData.sel = JSON.parse(JSON.stringify(row))
      row.isSet = false
      this.tableData.data.splice(index, 1, row)
      if (row.id === null) {
        this.tableData.data.splice(index, 1)
      }
    },
    delData(row, index) {
      this.$emit('del', row.id)
      this.tableData.data.splice(index, 1)
    }
  }
}
</script>

<style scoped>
  .el-table-add-row {
    margin-top: 10px;
    width: 100%;
    height: 34px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
    line-height: 34px;
  }
</style>
