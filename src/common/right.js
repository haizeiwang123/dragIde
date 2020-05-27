import React from 'react';
import '../App.css';
import './right.css'
import utils from '../utils'
import getProps from '../utils/getProps'
import getEvent from '../utils/getEvent'
import MonacoEditor from 'react-monaco-editor';
import { Tabs } from 'antd';
import { Form, Input, Button, Switch, Select, Radio, Collapse, Drawer } from 'antd';
import DataConfig from '../component/dataConfig'
import List from '../component/list'
const { Option } = Select;
const { TabPane } = Tabs;
export default class App extends React.Component {
  constructor(props) {
    super(props)
    let editObj = utils.deepCopy(props.state.editObj);
    let eventArr = getEvent(props.state.editObj.nameSpace);
    this.state = {
      ...props.state, showDataConfig: false, editObj: editObj, eventKey: [],
      eventData: {
        type: eventArr ? "组件事件" : "原生事件",
        data: eventArr || ["onClick", "onChange", "onBlur", "onMouseDown"]
      }
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = utils.deounce(this.handleChange.bind(this), 10);
    this.handleEventClick = this.handleEventClick.bind(this)
    this.showEvent = this.showEvent.bind(this)
    this.confirmEvent = this.confirmEvent.bind(this)
    this.onChangeEvent = this.onChangeEvent.bind(this)
  }
  componentWillReceiveProps(props, state) {
    this.setState({
      ...props.state
    })
  }

  handleClick = (e, key, item) => {
    if (item.children.length === 0) return;
    e.target.className = e.target.className.indexOf("close") >= 0 ? "open" : "close";
  }

  handleChange = (data, value) => {//该方法用以可以直接进行赋值的属性，例如input change switch change
    let { name: key, type } = data;
    let schema = utils.deepCopy(this.state.schema);
    let editObj = utils.deepCopy(this.state.editObj);
    switch(type){
      case "boolean":
        editObj.props[key] = value;
        break;
      case "loop":
        editObj.loop = value;
        break;
      default:
        editObj.props[key] = value;
        break
    }
    
    utils.replaceObj(schema, this.state.editObj.key.split("-"), editObj);
    this.props.changeSchema({
      schema: schema,
      editObj: editObj
    })
  }
  
  handleEventClick = (values) => {
    let value = values["event"];
    if (!values) return;
    let editObj = utils.deepCopy(this.state.editObj);
    if (editObj.props[value]) return;
    editObj.props[value] = new Function("return " + `function ${value}(e) {

    }`)();
    this.setState({
      editObj: editObj
    })
  }
  showEvent = (key, language) => {
    let keyArr = String(key).split("-");
    let target = keyArr.length === 1 ? this.state.editObj[keyArr[0]] : this.state.editObj[keyArr[0]][keyArr[1]];
    let defaultValue = "";
    if (typeof target == "function") {
      defaultValue = String(target);
    } else {
      if (typeof target === "object") {
        defaultValue = JSON.stringify(target, null, 2)
      } else {
        defaultValue = "{}"
      }
    }
    console.log(defaultValue)
    this.setState({
      eventDia: true,
      eventKey: keyArr,
      language: language,
      defaultValue: defaultValue
    })

  }
  onChangeEvent = (val) => {
    let editObj = utils.deepCopy(this.state.editObj);
    let changeKey = this.state.eventKey
    try {
      if (changeKey.length === 1) {
        editObj[changeKey[0]] =typeof val===String?JSON.parse(val):val;
      } else {
        if (/^on.*/.test(changeKey[1])) {
          editObj[changeKey[0]][changeKey[1]] = new Function(`return ` + val)();
        } else {
          editObj[changeKey[0]][changeKey[1]] = JSON.parse(val);
        }
      }
    } catch (e) {
      console.log(e)
    }
    this.setState({
      editObj: editObj
    })
  }

  confirmEvent = () => {
    let schema = utils.deepCopy(this.state.schema);
    let editObj = utils.deepCopy(this.state.editObj);
    utils.replaceObj(schema, String(this.state.editObj.key).split("-"), editObj);
    this.props.changeSchema({
      schema: schema,
      editObj: editObj,
      eventDia: false
    })
  }

  runderType = (item) => {//根据可枚举的属性 runder不同的修改组件去修改当前类型
    switch (item.type) {
      case "string":
        return <Input className="propMain" defaultValue={this.state.editObj.props[item.name]} onChange={(e) => {
          e.stopPropagation();
          this.handleChange(item, e.target.value)
        }} />
      case "array":
        return <Button block className="propMain" size="small" type="primary" onClick={(e) => {
          this.setState({arrDia:true,arrData:this.state.editObj.props[item.name],eventKey:item.name})
          console.log(this.state.editObj.props[item.name])
        }} >点击设置</Button>
      case "radioGroup":
        return <Radio.Group size="small" value={this.state.editObj.props[item.name]} onChange={(e) => {
          this.handleChange(item, e.target.value)
        }}>
          {
            item.data.map(v => {
              return <Radio.Button key={"label" + v.label} value={v.value}>{v.label}</Radio.Button>
            })
          }
        </Radio.Group>
      case "function":
        return <div className={this.state.isFull ? "monacoViewFixed" : "monacoView"}>
          <MonacoEditor
            width={this.state.isFull ? window.innerWidth : 280}
            height={this.state.isFull ? window.innerHeight : 280}
            language="javascript"
            theme="vs-dark"
            value={this.state.editObj.props[item.name]}
            options={{
              selectOnLineNumbers: true
            }}
          />
          <span onClick={() => {
            this.setState({
              isFull: !this.state.isFull
            })
          }} className={"iconfont monacoViewIcon " + (!this.state.isFull ? "icon-iconset0430" : "icon-shouqi")} />
          <Button type="primary" onClick={() => { console.log(123) }} style={{ marginTop: "10px" }}>确定</Button>
        </div>
      case 'boolean':
        return <Switch checked={!!this.state.editObj.props[item.name]} onChange={(checked) => {
          console.log(checked)
          this.handleChange(item, checked)
        }} />
      default:
        break;
    }
  }
  render() {
    return (
      <div className="myRight">

        <Tabs>
          <TabPane tab="属性" key="1">
            {//绑定的可枚举属性
              (this.state.editObj && this.state.editObj.nameSpace && getProps(this.state.editObj.nameSpace) || []).map((v, i) => {
                return <div className="propDiv" key={"editObj" + i}>
                  <span className="propText">{v.title}</span>
                  {
                    /\{\{.*\}\}/.test(String(this.state.editObj.props[v.name])) ? <Input key={"runderType"+v.name} defaultValue={""}  className="propMain" prefix="{{" suffix="}}"
                      onChange={(e) => {
                        this.handleChange(v, "{{" + e.target.value + "}}")
                      }}
                    /> : this.runderType(v)
                  }
                  <Button type="link" className="propButton" onClick={() => {
                    if (/\{\{.*\}\}/.test(String(this.state.editObj.props[v.name]))) {
                      this.handleChange(v, "")
                    } else {
                      this.handleChange(v, "{{}}")
                    }

                  }} icon={<i className="iconfont icon-daima"></i>}></Button>
                </div>
              })
            }
            {//绑定的事件 除了page上的事件
              this.state.editObj && this.state.editObj.nameSpace && this.state.editObj.nameSpace !== "page" && <Form name="validate_other" onFinish={(values) => {
                this.handleEventClick(values)
              }}>
                <Form.Item name="event" className="propDiv">
                  {/* <span className="propText">{this.state.eventData.type}</span> */}

                  <Select className="propMain" placeholder="请选择事件">
                    {
                      this.state.eventData.data.map(v => {
                        return <Option value={v} key={v}>{v}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
                {
                  (this.state.editObj && this.state.editObj.props && Object.keys(this.state.editObj.props).filter(v => {
                    return v.indexOf("on") === 0
                  }) || []).map(v => {
                    return <div className="eventWrap" key={"eventDiv" + v}>
                      <span>{this.state.eventData.type}：</span>
                      <span className="textButton" onClick={() => {
                        this.showEvent("props-" + v, "javascript")
                      }}>{v}</span>
                      <span className="textButton iconfont icon-delete" onClick={()=>{
                        console.log("删除事件")
                      }}></span>
                    </div>
                  })
                }
                <div>
                  <Button block size="small" htmlType="submit" type="primary">添加事件</Button>
                </div>
              </Form>
            }
            <div>
              <Button block size="small" style={{ marginTop: "20px" }} onClick={() => {
                this.showEvent("props-style", "json")
              }} htmlType="submit" type="primary">修改样式</Button>
            </div>
          </TabPane>
          {/* <TabPane tab="样式" key="2">
           
          </TabPane> */}
          <TabPane tab="数据" key="3">
            <DataConfig showDataConfig={this.state.showDataConfig} close={() => { this.setState({ showDataConfig: false }) }}></DataConfig>
            {
              this.state.editObj && this.state.editObj.nameSpace && this.state.editObj.nameSpace !== "page" && <div className="propDiv">
                <span className="propText">循环数据</span>
                {
                  /\{\{.*\}\}/.test(String(this.state.editObj.loop))?<Input prefix="{{" suffix="}}" className="propMain" defaultValue={this.state.editObj && this.state.editObj.loop || ""} onChange={(e) => {
                    this.handleChange({name:"",type:"loop"},"{{"+e.target.value+"}}")
                  }} />:<Input  className="propMain"  defaultValue={this.state.editObj ? this.state.editObj.loop : ""} onChange={(e) => {
                    this.handleChange({name:"",type:"loop"},e.target.value)
                  }} />
                }
         
                <Button type="link" className="propButton" onClick={() => {
                    if (/\{\{.*\}\}/.test(String(this.state.editObj.loop))) {
                      this.handleChange({name:"",type:"loop"}, "")
                    } else {
                      this.handleChange({name:"",type:"loop"}, "{{}}")
                    }
                  }} icon={<i className="iconfont icon-daima"></i>}></Button>
              </div>
            }
            {
              this.state.editObj && this.state.editObj.nameSpace && this.state.editObj.nameSpace === "page" && <div>
                <Collapse defaultActiveKey={['1', '2', '3']}>
                  <Collapse.Panel header="页面组件初始数据设置" key="1">
                    <Button onClick={() => {
                      this.showEvent("state", "json")
                    }} block size="small" htmlType="submit" type="primary">设置初始state</Button>
                  </Collapse.Panel>
                  <Collapse.Panel header="页面组件初始数据设置" key="2">
                    <Button block size="small" onClick={() => { this.setState({ showDataConfig: true }) }} htmlType="submit" type="primary">添加异步数据源</Button>
                  </Collapse.Panel>
                  <Collapse.Panel header="页面组件初始数据设置" key="3">
                    <Button block size="small" htmlType="submit" type="primary">异步数据源处理函数</Button>
                  </Collapse.Panel>
                </Collapse>
              </div>
            }
          </TabPane>
        </Tabs>
        {//事件编辑器的值,属性编辑器，使用与更改事件，更改page的state属性
          this.state.eventDia && <Drawer
            title={{ "state": "编辑内联样式" }[this.state.eventKey[0]] || "属性编辑"}
            placement="right"
            width="560"
            closable={false}
            visible={this.state.eventDia}
            footer={
              <div style={{textAlign: 'right'}}>
                <Button type="primary" style={{ marginRight: "10px" }} onClick={() => { this.confirmEvent() }}>确定</Button>
                <Button onClick={() => { this.setState({ eventDia: false }) }}>取消</Button>
              </div>
            }
          >
            <div>
              <MonacoEditor
                width={512}
                height={window.innerHeight - 160}
                language={this.state.language}
                theme="vs-dark"
                key={this.state.eventKey.join("-")}
                defaultValue={this.state.defaultValue}
                onChange={this.onChangeEvent}
                options={{
                  selectOnLineNumbers: true
                }}
              />
            </div>
          </Drawer>

        }
        {
          this.state.arrDia&& <List arrDia={this.state.arrDia} key={"addDia"} data={this.state.arrData||[]} comfirm={(value)=>{
                this.handleChange({name:this.state.eventKey,value:""},value)
          }} hide={()=>{this.setState({arrDia:false})}}></List>
        }
       
      </div>
    )
  }
}


