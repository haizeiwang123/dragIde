import React from 'react';
import './left.css';
import utils from '../utils'
const img = new Image()
img.src = 'https://gw.alicdn.com/tfs/TB1u9lvGFY7gK0jSZKzXXaikpXa-32-32.png'
img.height="10px"

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state={...props.state}
    this.handleOndragEnter = this.handleOndragEnter.bind(this);
    this.handleOndragLeave = this.handleOndragLeave.bind(this);
    this.handleOndragStart = this.handleOndragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleRender = this.handleRender.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDelNode = this.handleDelNode.bind(this);
  }
  // componentDidUpdate=()=>{
  //   document.onkeydown=(event)=>{
  //     var keycode = event.keyCode;
  //     if(keycode === 8 ) {
  //       if(!this.state.editObj)return ;
  //       let schema=utils.deepCopy(this.state.schema);
  //       let editObj=utils.deepCopy(this.state.editObj);
  //       let startKey=editObj.key;
  //       utils.getDownObj(schema,startKey.split("-"));
  //       this.props.changeSchema({
  //         schema:[...schema],
  //         editObj:schema[0]
  //       })
  //       let nodeArr=document.getElementsByClassName("nowSelect");
  //       nodeArr&&nodeArr[0]&&(nodeArr[0].className="")
  //     }
  //   };
  // }
  static getDerivedStateFromProps(props,state){
    let editObj=utils.deepCopy(props.state.editObj);
    editObj.state=JSON.stringify(editObj.state||{},null,2);
    return {...props.state,editObj:editObj};
  }
  handleSelect=(e,key,item)=>{
    let selectArr=document.getElementsByClassName("nowSelect");
    for(let i=0;i<selectArr.length;i++){
      selectArr[i].className="leftWrap"
    }
    e.currentTarget.className= "leftWrap nowSelect"
    this.props.changeSchema({
      editObj:{...item,key:key},
    })
  }

  handleDelNode=(e,startKey)=>{
    e.stopPropagation();
    let schema=utils.deepCopy(this.state.schema);
    utils.getDownObj(schema,startKey.split("-"));
    this.props.changeSchema({
      schema:[...schema],
      editObj:{...schema[0],key:"0"}
    })
    let selectArr=document.getElementsByClassName("nowSelect");
    for(let i=0;i<selectArr.length;i++){
      selectArr[i].className="leftWrap"
    }
  }
  handleOndragEnter =(e,key)=>{
    // e.currentTarget.className="select"
  }
  handleOndragStart =(e,key)=>{
    e.dataTransfer.setData("key",key);
    e.dataTransfer.setDragImage(img, 0, 0)
    let parentNode=document.getElementById("li"+key);
    setTimeout(() => {
      parentNode.className=parentNode.className.replace("open","close")
    }, 0);
  }
  handleOndragLeave=(e,key)=>{
    e.currentTarget.className="leftWrap"
  }
  handleDragOver=(e)=>{
      let enterPageY= window._pageY||0;
      let allNum=utils.getOffsetTop(e.currentTarget);
      let diffNum=e.pageY-allNum;
      let children=e.currentTarget.children[0];
      if(children.className.indexOf("icon-ceng")<0){//只有层标签才可以放到组件里面
        if(diffNum<e.target.offsetHeight/2){
          let position=e.pageY-enterPageY>0?"beforeSelect":"afterSelect";
          e.currentTarget.className="leftWrap "+position
          window._position=position;
        }else{
          let position=e.pageY-enterPageY>0?"afterSelect":"beforeSelect";
          e.currentTarget.className="leftWrap "+position
          window._position=position;
        }
      }else{
        if(diffNum<e.target.offsetHeight/3){
          let position=e.pageY-enterPageY>0?"beforeSelect":"afterSelect";
          e.currentTarget.className="leftWrap "+position
          window._position=position;
        }else if(diffNum>e.target.offsetHeight/3*2){
          let position=e.pageY-enterPageY>0?"afterSelect":"beforeSelect";
          e.currentTarget.className="leftWrap "+position
          window._position=position;
        }else{
         // eslint-disable-next-line no-useless-concat
         e.currentTarget.className="leftWrap " + "select";
         window._position="select";
        }
      }
  }
  handleDragEnd=(e,start)=>{
    e.target.className=e.target.className==="open"?"close":"open";
  }

  handleDrop=(e,endKey)=>{
    e.currentTarget.className="leftWrap"
    let startKey=e.dataTransfer.getData("key");
    
    let endKeyArr=endKey.split("-");
    let startKeyArr=startKey.split("-");
    if(endKey.indexOf(startKey.replace(/-\d$/,""))>=0&&parseInt(endKeyArr[startKeyArr.length-1])>parseInt(startKeyArr[startKeyArr.length-1])){
      endKeyArr[startKeyArr.length-1]=endKeyArr[startKeyArr.length-1]-1;
    }
    let schema=utils.deepCopy(this.state.schema);
    let nowObj={}
    if(startKey==="insert"){
      nowObj=JSON.parse(e.dataTransfer.getData("item"));
    }else{
      nowObj=utils.getDownObj(schema,startKey.split("-"));
    }
    utils.inserObj(schema,endKeyArr,{...nowObj},window._position);
    this.props.changeSchema({
      schema:[...schema]
    })
  }
  handleClick=(e,key,item)=>{
    console.log(item)
    if(item.children.length===0)return ;
    e.target.className= e.target.className.indexOf("close")>=0?"open":"close";
  }
 
  handleRender=(node,key)=>{
    return <li  key={key} id={"li"+key}  className={ Array.isArray(node.children)&&node.children.length>0?"open":""} onClick={(e)=>{
      e.stopPropagation();
      this.handleClick(e,key,node)
    }}>
        <div className="leftWrap" id={"data"+key} onClick={(e)=>{
      e.stopPropagation();
      this.handleSelect(e,key,node)
    }} onDragEnd={(e)=>{
      e.stopPropagation();
      this.handleDragEnd(e,key);
    }}  onDragStart={(e)=>{
      e.stopPropagation();
      // setDragImage(img, xOffset, yOffset)
      this.handleOndragStart(e,key)
    }} 
    onDragOver={(e)=>{
      e.preventDefault();
      e.stopPropagation()
      this.handleDragOver(e,key)
    }}
    onDrop={(e)=>{
      e.stopPropagation()
      this.handleDrop(e,key)
    }}
    onDragLeave={(e)=>{
      e.stopPropagation();
      this.handleOndragLeave(e,key)
    }}
    onDragEnter={(e)=>{
      e.preventDefault();
      e.stopPropagation();
      this.handleOndragEnter(e,key)
    }}   draggable="true" >
          <span className={"iconfont "+(utils.iconArr[node.nameSpace]||"icon-ceng") }>
            
          </span>
          {node.nameSpace}
          <span onClick={(e)=>{
            this.handleDelNode(e,key)
          }} className={"iconfont icon-delete"}></span >
          <span className={"iconfont icon-close"}></span >
        </div>
        {
          Array.isArray(node.children)&&node.children.length>0&&<ul>
            {
              node.children.map((v,i)=>{
                    return this.handleRender(v,key+"-"+i)
              })
            }
          </ul>
        }
    </li>
}
 
 
  render() {
    return (
        <div className="myLeft">
          <ul>
            {
              this.handleRender(this.state.schema[0],0)
            }
          </ul>
        </div>
       
    )
  }
}


