import React from 'react';
import '../App.css';
import './right.css'
import utils from '../utils'
import getProps from '../utils/getProps'
import MonacoEditor from 'react-monaco-editor';
import { Tabs } from 'antd';
import { Form, Input, Button, Switch,Select,Radio } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...props.state };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = utils.deounce(this.handleChange.bind(this), 50);
    this.handleMonacoChange = utils.deounce(this.handleMonacoChange.bind(this), 50);
    this.handleEventClick = this.handleEventClick.bind(this)
    this.showEvent = this.showEvent.bind(this)
    this.confirmEvent = this.confirmEvent.bind(this)
    this.onChangeEvent = this.onChangeEvent.bind(this)
  }
  componentWillReceiveProps(props) {
    this.setState(props.state)
    return true;
  }
  handleClick = (e, key, item) => {
    if (item.children.length === 0) return;
    e.target.className = e.target.className.indexOf("close") >= 0 ? "open" : "close";
  }
  handleMonacoChange = (data, value)=>{
    let {name:key,type}=data;
    let editObj = utils.deepCopy(this.state.editObj);
    if(type==="boolean"){
      editObj.props[key] =value;
    }else{
      editObj.props[key] = String(value);
    }
    this.props.changeSchema({
      editObj: editObj
    })
  }

  handleChange = (data, value) => {
    let {name:key,type}=data;
    let schema = utils.deepCopy(this.state.schema);
    let editObj = utils.deepCopy(this.state.editObj);
    if(type==="boolean"){
      editObj.props[key] =value;
    }else{
      editObj.props[key] = String(value);
    }
    utils.replaceObj(schema, this.state.editObj.key.split("-"), editObj);
    this.props.changeSchema({
      schema: schema,
      editObj: editObj
    })
  }
  handleLoopChange = (value) => {
    let editObj = utils.deepCopy(this.state.editObj);
    if (!editObj) return;
    let schema = utils.deepCopy(this.state.schema);
    editObj.loop = String(value);
    utils.replaceObj(schema, this.state.editObj.key.split("-"), editObj);
    this.props.changeSchema({
      schema: schema,
      editObj: editObj
    })
  }
  handleEventClick = (values) => {
    let value=values["event"];
    if(!values) return ;
    let editObj = utils.deepCopy(this.state.editObj);
    if(editObj.props[value])return ;
    editObj.props[value] = `function onClick(e) {

    }`;
    this.setState({
      editObj: editObj
    })
  }
  showEvent = (key) => {
    this.setState({
      eventDia: true,
      eventKey: key
    })
  }
  onChangeEvent = (val) => {
    let editObj = utils.deepCopy(this.state.editObj);
    editObj.props[this.state.eventKey] = val;
    this.setState({
      editObj: editObj
    })
  }

  confirmEvent = () => {
    let schema = utils.deepCopy(this.state.schema);
    let editObj = utils.deepCopy(this.state.editObj);
    // editObj.props[this.state.eventKey] = new Function('return ' + editObj.props[this.state.eventKey])();
    utils.replaceObj(schema, this.state.editObj.key.split("-"), editObj);
    this.props.changeSchema({
      schema: schema,
      editObj: editObj,
      eventDia: false
    })
  }

  runderType = (item) => {
    switch (item.type) {
      case "input":
        return <Form.Item
            label={item.title}
          >
          <Input value={this.state.editObj.props[item.name]} onChange={(e) => {
            e.stopPropagation();
            this.handleChange(item, e.target.value)
          }} />
        </Form.Item>
      case "radioGroup":
        return <Form.Item
            label={item.title}
          >
            <Radio.Group value={this.state.editObj.props[item.name]} onChange={(e) => {
            this.handleChange(item, e.target.value)
          }}>
            {
              item.data.map(v=>{
                return <Radio.Button value={v.value}>{v.label}</Radio.Button>
              })
            }
            </Radio.Group>
        </Form.Item>
      case "function":
        return <Form.Item
        label={item.title}>
          <div className={this.state.isFull ? "monacoViewFixed" : "monacoView"}>
          
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
           <Button  type="primary" onClick={() => { console.log(123) }}  style={{marginTop:"10px"}}>确定</Button>
        </div>
        </Form.Item>
      case 'boolean':
        return <Form.Item
          label={item.title}
        >
        <Switch checked={!!this.state.editObj.props[item.name]} onChange={(checked)=>{
          console.log(checked)
           this.handleChange(item, checked)
        }} />
      </Form.Item>
      default:
        break;
    }
  }
  render() {
    return (
      <div className="myRight">
        <Tabs>
          <TabPane tab="属性" key="1">
            <Form>
              {
                (this.state.editObj && this.state.editObj.nameSpace &&getProps(this.state.editObj.nameSpace)||[]).map((v,i) => {
                  return <div key={"editObj" + i}>
                    {
                      this.runderType(v)
                    }
                  </div>
                })
              }
              {
                this.state.editObj && this.state.editObj.nameSpace && this.state.editObj.nameSpace !== "page" &&<Form name="validate_other" onFinish={(values)=>{
                  console.log(values,"values")
                  this.handleEventClick(values)
                }}>
                  <Form.Item name="event" label={"原生事件"}>
                    <Select placeholder="请选择事件">
                      {
                        ["onClick","onChange","onBlur","onMouseDown"].map(v=>{
                          return <Option value={v} key={v}>{v}</Option>
                        })
                      }
                    </Select>
                  </Form.Item>

                  {
                    (this.state.editObj && this.state.editObj.props && Object.keys(this.state.editObj.props).filter(v => {
                      return v.indexOf("on") === 0
                    })||[]).map(v=>{
                      return <div className="eventWrap" key={"eventDiv"+v}>
                          <span>原生事件：</span>
                          <span className="textButton" onClick={() => {
                            this.showEvent(v)
                          }}>{v}</span>
                      </div>
                    })
                  }

                  <div>
                      <Button block size="small" htmlType="submit" type="primary">添加事件</Button>
                  </div>
                  </Form>
              }

              {
                this.state.eventDia && <div className="monacoViewFixed">
                  <MonacoEditor
                    width={window.innerWidth}
                    height={window.innerHeight}
                    language="javascript"
                    theme="vs-dark"
                    value={String(this.state.editObj.props[this.state.eventKey])}
                    onChange={this.onChangeEvent}
                    options={{
                      selectOnLineNumbers: true
                    }}
                  />
                  <div className="fixedButon">
                    <Button  onClick={() => { this.confirmEvent() }}>确定</Button>
                    <Button  onClick={() => { this.setState({ eventDia: false }) }}>取消</Button>
                  </div>
                </div>
              }
            </Form>
          </TabPane>
          <TabPane tab="样式" key="2">
           <div className={this.state.isFull ? "monacoViewFixed" : "monacoView"}>
              <Form.Item
              label={""}
            >
              <MonacoEditor
                width={this.state.isFull ? window.innerWidth : 280}
                height={this.state.isFull ? window.innerHeight : 280}
                language="json"
                theme="vs-dark"
                onChange={
                  (value)=>{
                    this.handleMonacoChange({name:"style",type:"string"},value)
                  }
                }
                value={this.state.editObj.props["style"]||JSON.stringify({},null,2)}
                options={{
                  selectOnLineNumbers: true
                }}
              />
              <span onClick={() => {
                this.setState({
                  isFull: !this.state.isFull
                })
              }} className={"iconfont monacoViewIcon " + (!this.state.isFull ? "icon-iconset0430" : "icon-shouqi")}></span>
              <Button  type="primary" onClick={() => { this.confirmEvent(); }} style={{marginTop:"10px"}}>确定</Button>
              </Form.Item>
            </div>
          </TabPane>
          <TabPane tab="数据" key="3">
              {
                this.state.editObj && this.state.editObj.nameSpace && this.state.editObj.nameSpace !== "page" && <div>
                  <Form.Item
                    label="设置循环变量："
                  >
                  <Input value={this.state.editObj && this.state.editObj.loop || ""} onChange={(e) => {
                    this.handleLoopChange(e.target.value)
                  }} />
                </Form.Item>
                </div>
              }
          </TabPane>
        </Tabs>
      </div>
    )
  }
}


