<template>
    <div class="input-box">
        <el-table width  :data="list" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column label="姓名" width="350%" align="center">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.nickName" :disabled="!scope.row.disabled"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="时间" width="350%" align="center">
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.createTime" type="date" placeholder="选择日期" :disabled="!scope.row.disabled"></el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="地址" width="350%" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.avatar" clearable  :disabled="!scope.row.disabled">
                        <el-option
                            v-for="item in ads"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value" >
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="200%">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.edit" type="success" size="mini" icon="el-icon-check" circle
                         @click="confirmEdit(scope.row)">
                  </el-button>
                  <el-button v-else type="primary" size="mini"
                        @click="startEdit(scope.row)">编辑
                  </el-button>
                  <el-button size="mini" v-if="!scope.row.edit" @click="deleteRow(scope.row)"> 移除 
                  </el-button>
                  <el-button v-if="scope.row.edit" class="cancel-btn" size="mini"
                        type="warning" @click="cancelEdit(scope.row)">取消
                  </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button class="addrow-btn" size="mini" type="primary" @click="addRow ()">添加行</el-button>
    </div>
</template>

<script>
export default {
    data(){
      return{
       queryInfo:{},
       ads:[{text:'蜀国',value:'1'},{text:'魏国',value:'2'},{text:'吴国',value:'3'}],
       list: []
      }
    },
    
    created(){
        this.getUserList();
    },
    methods:{
        
        // 编辑
        startEdit(row) {
            row.edit = !row.edit;
            row.disabled = true;
            
        },
        deleteRow(row) {//删除改行
            let data = {"id":row.id,"name":row.nickName,"nickName":row.nickName, "createTime":row.createTime,"avatar":row.avatar};
            this.$http.post('user/deleteInfo',data);
            this.getUserList();
            //rows.splice(index, 1);
        },
        addRow () {
          let newLine = {
            name: this.nickName,
            createTime: this.createTime,
            avatar: this.avatar,
            edit: true, // 新增时处于可编辑状态，所以按钮是保存和取消
            disabled: true // 打开编辑状态
          };
          this.list.unshift(newLine); // 移到第一行
        },

        // 保存
        confirmEdit(row) {
            row.edit = false;
            let data = {"id":row.id,"name":row.nickName,"nickName":row.nickName, "createTime":row.createTime,"avatar":row.avatar};
            //调用后端保存接口
            if(row.id!==undefined){
                this.$http.post('user/updateInfo',data);
                this.$message({
                    message: '已修改!',
                    type: 'success'
                });
            }else{
                this.$http.post('user/addInfo',data);
                this.$message({
                    message: '添加成功!',
                    type: 'success'
                });
            }
            row.disabled = false;
            this.getUserList();
        },

        async getUserList(){
            const{data:res} = await this.$http.get("user/findAll", {params:this.queryInfo})
            //console.log(res)
            
            this.list = res
        },

        // 取消
        cancelEdit(row) {
          row.edit = false;
          row.disabled = false;
          this.$message({
            message: '已取消修改!',
            type: 'warning'
          });
          this.getUserList();
        }
    }
}
</script>

<style lang="less" scoped>
    input[disabled], input:disabled, input.disabled {
    color: #000000;
    -webkit-text-fill-color: #000000;
    -webkit-opacity: 1;
    opacity: 1;
    font-weight: 900;
  }
</style>
