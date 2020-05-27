import React from 'react';
import Page from '../component/page'
import './main.css'
import utils from '../utils/index'
import { Button,Table,Pagination,Form,Input,Select} from 'antd';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.handleRender = this.handleRender.bind(this);
    this.state = {
      ...props.schema[0].state
    };
    this.textAreaRef = React.createRef();
    window.t=this;
  }

  componentWillReceiveProps(props) {
    try{
      this.setState(props.schema[0].state||{})
    }catch(e){
      console.log(e)
    }
  }
  handlePageRender = (node, key) => {
    node = utils.deepCopy(node);
    delete node.state;
    return this.handleRender(node, key, this)
  }
  handleRender = (node, key, parent) => {
    node = utils.deepCopy(node);
    try{
      node.__proto__ = parent;
    }catch(e){
      console.log("原型链报错")
      console.log(e)
    }
    
    if (node.props && node.props.ishide) {
      return null;
    }

    if (node.hasOwnProperty("loop") && node.loop) {
      try {
        let arr = /\{\{.*?\}\}/.test(node.loop) ? new Function("return " + node.loop.replace(/\{|\}/gi, "")).bind(node)() : [];
        return Array.isArray(arr) && new Function("return " + `${node.loop.replace(/\{|\}/gi, "")}.map((${"item"},${"index"})=>{
              let node= arguments[3].deepCopy(arguments[0]);
              node.props={...arguments[0].props}
              node['${"item"}']=${"item"};
              node.loop=undefined;
              return this.handleRender(node,arguments[1]+"-"+${"index"},arguments[2])
          })`).bind(node)(node, key + "-loop", parent, utils)
      } catch (e) {
        console.log("循环报错")
        console.log(e)
      }
      return null;
    }
    //解析模板字符串
    const parseObject=(obj,node)=>{
      Object.keys(obj).forEach(v=>{
        let matchs = String(obj[v]).match(/\{\{.*?\}\}/);
        if (matchs&&obj[v]) {
          try {
            obj[v] = new Function("return " + obj[v].replace(/\{|\}/gi, "")).bind(node)();
          } catch (e) {
            obj[v] = "";
          }
        }
        

        if(typeof node.props[v]==="function"){
          obj[v]=obj[v].bind(node);
        }
        if(matchs&&["{{this}}","{{t}}","{{this.state}}"].includes(matchs[0])){
          obj[v]=String(obj[v])
        }
        //如果解析出来是一个对象，并且里面仍然含有模板字符串，需要再次往下解析，否则不再解析
        if(obj[v]==="")
        if(typeof obj[v]==="object"&&/\{\{.*\}\}/.test(JSON.stringify(obj[v]))){
          parseObject(obj[v],node)
        }
      })
    }

    parseObject(node.props,node);//批量处理属性榜单
   
    let children=[];
    if(node.nameSpace==="tableColumn"){
      children= Array.isArray(node.children) && node.children || [];
      if(children.length>0){
        node.props.render=(arr,record,index)=>{
          return <div>
            {
               children.map((v,i)=>{
                node.record=record;
                node.index=index;
                return this.handleRender(v, key + "-tableColumn-" + i, node)
              })
            }
          </div>
        }
      }
    }else{
      children = (Array.isArray(node.children) && node.children || []).map((v, i) => {
        return this.handleRender(v, key + "-" + i, node)
      }) || [];
      if(children.length>0){
        node.props&&(node.props.children=children)
      }
    }
    
    switch (node.nameSpace) {
      case "page":
        return <Page self={this} state={this.state} key={"page" + key} id={"div" + key} >
          {
            children
          }
        </Page>
      case "div":
        return <div   {...node.props} key={"div" + key} />;
      case "table":
          return <Table key={"table" + key} pagination={false} {...node.props} />
      case "tableColumn":
        return <Table.Column key={"tableColumn"} {...node.props} />
      case "select":
        return <Select key={"tableColumn"} {...node.props} />
      case "button":
        return <Button key={"button" + key} {...node.props} />
      case "text":
        return <span key={"span" + key} {...node.props} />;
      case "img":
        return <img key={"img" + key}   {...node.props} />;
      case "form":
        if(node.props.name){
          let form=React.createRef();
          this[node.props.name]=form;
          node.props.ref=form
        }
        return <Form key={"form" + key}   {...node.props}  />
      case "formItem":
        return <Form.Item key={"formItem" + key}   {...node.props}  />
      case "input":
        return <Input key={"input" + key}   {...node.props}  />
      case "pagination":
          return <Pagination key={"input" + key}   {...node.props}  />
      default:
        return null;
    }


  }
  render() {
    return (
      <div className="mainCanvas">
        {
          this.handlePageRender(this.props.schema[0], 0)
        }
      </div>
    )
  }
}


