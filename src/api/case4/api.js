//数据接口 by maguobin 2020310
export default {
	maxexpandId: 95,
	treelist: [{
	    id: 1,    //id
	    name: "辽宁省",//标签名称--一级
	    ProSort: 1, //排序
	    remark: "省份",//标签备注
	    pid: '',//父级字段
	    isEdit: false,  //判断焦点
	    children: [{
			id: 35,
			name: "沈阳市",//子节点名称
			pid: 1,//父级字段
			remark: '',
			isEdit: false,
			children: []
		},{
			id: 36,
			name: "大连市",
			pid: 1,
			remark: '',
			isEdit: false,
			children: []
		},{
			id: 37,
			name: "鞍山市",
			pid: 1,
			remark: '',
			isEdit: false,
			children: []
		},{
			id: 38,
			name: "阜新市",
			pid: 1,
			remark: '',
			isEdit: false,
			children: []
		},{
			id: 39,
			name: "抚顺市",
			pid: 1,
			remark: '',
			isEdit: false,
			children: []
		},{
			id: 40,
			name: "铁岭市",
			pid: 1,
			remark: '',
			isEdit: false,
			children: []
		}]
	}, {
	    id: 2,
	    name: "天津市",
	    ProSort: 2,
	    remark: "直辖市",
	    pid: '',
	    isEdit: false,
	    children: [{
			id: 41,
			name: "北辰区",
			pid: 2,
			remark: '',
			isEdit: false,
			children: []
		},{
			id: 42,
			name: "河北区",
			pid: 2,
			remark: '',
			isEdit: false,
			children: []
		},{
			id: 43,
			name: "西青区",
			pid: 2,
			remark: '',
			isEdit: false,
			children: []
		},{
			id: 44,
			name: "东丽区",
			pid: 2,
			remark: '',
			isEdit: false,
			children: []
		}]
	}, {
	    id: 3,
	    name: "吉林省",
	    ProSort: 4,
	    remark: "省份",
	    pid: '',
	    isEdit: false,
	    children: [{
			id: 54,
			name: "长春市",
			pid: 4,
			remark: '',
			isEdit: false,
			children: []
		}]
	}, {
	    id: 4,
	    name: "黑龙江省",
	    ProSort: 3,
	    remark: "省份",
	    pid: '',
	    isEdit: false,
	    children: [{
			id: 55,
			name: "哈尔滨市",
			pid: 8,
			remark: '',
			isEdit: false,
			children: []
		}]
	}]
}
