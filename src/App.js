import React from 'react';
import './App.css';
import Main from './common/main'
import Left from './common/left'
import Components from './common/components'
import Right from './common/right'
import utils from './utils'
import getData from './utils/getData'
let ide=utils.getQueryParam("ide");

// injectIframeContent = () => {
//   const ideConfig = this.appHelper.ideConfig;
//   const hasInnerAddon =
//     ideConfig && ideConfig.addons && ideConfig.addons.canvas && ideConfig.addons.canvas.length > 0;
//   this.iframe.contentWindow.document.open();
//   this.iframe.contentWindow.document.write(`
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
//     <meta name="format-detection" content="telephone=no">
//     <link rel="stylesheet" href="${window.__assets.vendorUrl}/css/index.css">
//     ${hasInnerAddon ? `<link rel="stylesheet" href="${window.__assets.ideUrl}/css/inner.css">` : ''}
//     <link rel="stylesheet" href="${window.__assets.canvasUrl}/css/canvas.css">
//     <script>
//       window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
//     </script>
//     ${window.__assets.polyfillUrl ? `<script src="${window.__assets.polyfillUrl}"></script>` : ''}
//     <style>
//       :root {
//         --brand-color: ${this.props.brandColor};
//       }
//       html,body,#root{
//         height: 100%;
//       }
//     </style>
//   </head>
//   <body>
//     <div id="root"></div>
//     <div id="canvas-addon"></div>
//     <script src="${window.__assets.vendorUrl}/js/index.js"></script>
//     ${hasInnerAddon ? `<script src="${window.__assets.ideUrl}/js/inner.js"></script>` : ''}
//     <script src="${window.__assets.canvasUrl}/js/canvas.js"></script>
//   </body>
//   </html>
//   `);
//   this.iframe.contentWindow.document.close();
// };
export default class App extends React.Component{
  constructor(props){
    super(props)
    let schema=getData;
    this.state={
        start:"",
        enterArr:[],
        schema:schema,
        editObj:{...schema[0],key:0,state:JSON.stringify(schema[0].state,null,2)},
        num:12,
        selectTabs:"shu,ku,",
        getNum:"{{this.state.num}}"
    }
    this.ideIframe = React.createRef();
    this.handleSelectTabs=this.handleSelectTabs.bind(this);
    this.changeSchema=this.changeSchema.bind(this)
    window.changeSchema=(val)=>{
      this.changeSchema(val);
    };
  }
  handleSelectTabs=(e,type)=>{
    let flag=this.state.selectTabs.includes(type);
    console.log(flag)
    let str=flag?this.state.selectTabs.replace(type+",",""):(this.state.selectTabs+type+",");
    console.log(str)
    this.setState({
      selectTabs:str
    })
    setTimeout(() => {
      console.log(this.state.selectTabs)
    }, 0);
  }
  changeSchema=(obj)=>{
    if(obj.schema){
      window.schema=obj.schema;
    }
    if(obj.editObj){
      window.editObj=obj.editObj;
    }
    window.obj={...obj};
    this.setState({
      ...obj
    })
    if(!ide){
      window.ideIframe&&window.ideIframe.window&&window.ideIframe.window.changeSchema(obj)
    }
  }
  consoe=()=>{
    let res=<div style={{height:"100px"}}>12312</div>
    console.log(res)
    return res;
  }
  render() {
    return (
      <div className="allBg">
        <div className="myWrap">
          {
            (!ide)&&<div className="myTabs">
            <span onClick={(e)=>{
                this.handleSelectTabs(e,"shu")
            }} title="节点树" className={"iconfont tabsItem icon-jiedianxuanze"+(this.state.selectTabs.includes("shu")?" itemSelect":"")}></span>
            <span
            onClick={(e)=>{
              this.handleSelectTabs(e,"ku")
            }}
            title="组件库"
            className={"iconfont tabsItem icon-kufang"+(this.state.selectTabs.includes("ku")?" itemSelect":"")}></span>
        </div>
          }
            
            {
              this.state.selectTabs.includes("shu")&&(!ide)&&<Left state={this.state} changeSchema={this.changeSchema}></Left>||null
            }
            {
              this.state.selectTabs.includes("ku")&& (!ide)&&<Components state={this.state} changeSchema={this.changeSchema}></Components>||null
            }
              <div className="main">
                {
                  ide?<Main schema={this.state.schema}></Main>:<iframe name="ideIframe" className="ideIframe" ref={this.ideIframe} src="http://localhost:3000?ide=true"></iframe>
                }
                  
              </div>
            {
               (!ide)&&<Right key={this.state.editObj.key} state={this.state} changeSchema={this.changeSchema}></Right>
            }
        </div>
      </div>
    )
  }
}


