
<template>
  <div>
    <el-button size="small" style="margin: 10px;" @click="initChecked">初始化</el-button>
    <!--下拉树-->
    <tree-select
      :data="data"
      :default-props="defaultProps"
      :node-key="nodeKey"
      :checked-keys="defaultCheckedKeys"
      @popoverHide="popoverHide"
      multiple
    /> <!--multiple 控制是否可以多选-->
  </div>
</template>

<script>
import TreeSelect from '../../components/case1/tree-select.vue'
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
export default {
  name: 'Home',
  components: { TreeSelect },
  data() {
    return {
      data: menus,
      defaultProps: {
        children: 'childrenList',
        label: 'menuName'
      },
      nodeKey: 'menuId',
      defaultCheckedKeys: []
    }
  },
  created() {
  },
  mounted() {
    // 组建中增加了监听数据变化的，
    // 此处初始化defaultCheckedKeys的值，有效果
    this.defaultCheckedKeys = [1001]
  },
  methods: {
    // 改变默认选中的节点数据
    initChecked() {
      this.defaultCheckedKeys = [1006, 1007]
    },
    popoverHide(checkedIds, checkedData) {
      console.log(checkedIds)
      console.log(checkedData)
    }
  }
}
</script>

<style scoped>

</style>
