export default [
    {
        "nameSpace": "page",
        "state": { 
            "name": "我是小黑",
            "list":[
                {
                    "name":"我是小黑1",
                    "age":"16",
                    "address":"中国华夏地区",
                    "pic":"http://gw.alicdn.com/shop-logo//ce/75/TB1RPcQPVXXXXcrXFXXSutbFXXX.jpg"
                },
                {
                    "name":"我是小花",
                    "age":"16",
                    "address":"中国华夏地区2",
                    "pic":"http://gw.alicdn.com/bao/uploaded/TB1CAWazFY7gK0jSZKzXXaikpXa.jpg_360x10000Q75.jpg_.webp"
                },
                {
                    "name":"我是小花",
                    "age":"16",
                    "address":"中国华夏地区2",
                    "pic":"http://gw.alicdn.com/shop-logo//ce/75/TB1RPcQPVXXXXcrXFXXSutbFXXX.jpg"
                },
                {
                    "name":"我是小花",
                    "age":"16",
                    "address":"中国华夏地区2",
                    "pic":"http://gw.alicdn.com/bao/uploaded/TB1CAWazFY7gK0jSZKzXXaikpXa.jpg_360x10000Q75.jpg_.webp"
                },
                {
                    "name":"我是小花",
                    "age":"16",
                    "address":"中国华夏地区2",
                    "pic":"http://gw.alicdn.com/bao/uploaded/TB1CAWazFY7gK0jSZKzXXaikpXa.jpg_360x10000Q75.jpg_.webp"
                },
                {
                    "name":"我是小花",
                    "age":"16",
                    "address":"中国华夏地区2",
                    "pic":"http://gw.alicdn.com/bao/uploaded/TB1CAWazFY7gK0jSZKzXXaikpXa.jpg_360x10000Q75.jpg_.webp"
                },
                {
                    "name":"我是小花",
                    "age":"16",
                    "address":"中国华夏地区2",
                    "pic":"http://gw.alicdn.com/bao/uploaded/TB1CAWazFY7gK0jSZKzXXaikpXa.jpg_360x10000Q75.jpg_.webp"
                },
                {
                    "name":"我是小花",
                    "age":"16",
                    "address":"中国华夏地区2",
                    "pic":"http://gw.alicdn.com/shop-logo//ce/75/TB1RPcQPVXXXXcrXFXXSutbFXXX.jpg"
                },
                {
                    "name":"我是小花",
                    "age":"16",
                    "address":"中国华夏地区2",
                    "pic":"http://gw.alicdn.com/shop-logo//ce/75/TB1RPcQPVXXXXcrXFXXSutbFXXX.jpg"
                }
            ]
        },
        "props": {
            "propsHandle": "function propsHandler(propsMap) {\n        \n        return propsMap;\n      }"
        },
        "children": [
            {
                nameSpace: "form",
                title: "表单form",
                icon: "icon-pic",
                props: {
                    "layout":"inline",
                    style:{
                        "marginBottom":"20px"
                    }
                },
                children: [
                    {
                        nameSpace: "formItem",
                        title: "表单formItem",
                        icon: "icon-pic",
                        props: {

                        },
                        children: [
                            { 
                                nameSpace:"select",
                                title:"选择框",
                                icon:"icon-font",
                                props:{
                                    style:{
                                        width:"200px"
                                    },
                                    "placeholder":"请选择类型",
                                    options:[{label:"名称",value:"name"}]
                                },
                                children:[]
                            }
                        ]
                    },
                    {
                        nameSpace: "formItem",
                        title: "表单formItem",
                        icon: "icon-pic",
                        props: {

                        },
                        children: [
                            { 
                                nameSpace:"input",
                                title:"选择框",
                                icon:"icon-font",
                                props:{
                                    style:{
                                        width:"200px"
                                    },
                                    "placeholder":"请输入id",
                                },
                                children:[]
                            }
                        ]
                    },
                    {
                        nameSpace:"button",
                        title:"按钮",
                        icon:"icon-pic",
                        props:{
                            children:"提交"
                        },
                        children:[]
                    }
                ]
            },
            {
                "nameSpace": "table",
                "props": {
                    "dataSource":"{{this.state.list}}",
                    children: []
                },
                "children": [
                    {
                        "nameSpace": "tableColumn",
                        "props": { "title": "信息", "dataIndex": "name" },
                        "children": [
                            { "nameSpace": "text", "props": { "children": "{{this.record.name}}" }, "children": [] },
                            { "nameSpace": "img", "props": { 
                                "src": "{{this.record.pic}}",
                                "style":{
                                    "height":"40px",
                                    "borderRadius":"20px",
                                    "marginLeft":"10px"
                                }
                            }, "children": [] }
                        ],
                    },
                    { "nameSpace": "tableColumn", "props": { "title": "地址", "dataIndex": "address" }, "children": [] },
                    { "nameSpace": "tableColumn", "props": { "title": "年龄", "dataIndex": "age" }, "children": [] },
                    { "nameSpace": "tableColumn", "props": { "title": "操作", "dataIndex": "age" }, 
                        "children": [
                            {
                                nameSpace:"button",
                                title:"按钮",
                                icon:"icon-pic",
                                props:{
                                    children:"编辑",
                                    size:"small",
                                    type:"primary"
                                },
                                children:[]
                            },
                            {
                                nameSpace:"button",
                                title:"按钮",
                                icon:"icon-pic",
                                props:{
                                    children:"删除",
                                    size:"small",
                                    "style":{
                                        "marginLeft":"10px"
                                    }
                                },
                                children:[]
                            }
                        ] 
                    },
                ]
            },
            {
                nameSpace: "pagination",
                title: "分页Pagination",
                icon: "icon-pic",
                props: {
                    pageSize: 10,
                    defaultCurrent: 1,
                    total: 100,
                    showSizeChanger: false,
                    style:{
                        "marginTop":"20px",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex"
                    }
                },
                children: []
            }
        ]
    }]