import React from 'react';
import cats from '../utils/cats'
import { Input } from 'antd';
import './components.css';
import utis from '../utils/index'
const { Search } = Input;

const img = new Image()
img.src = 'https://gw.alicdn.com/tfs/TB1u9lvGFY7gK0jSZKzXXaikpXa-32-32.png'
img.height="10px"
export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state={
      catArr:cats
    }
    this.changeCat=utis.deounce(this.changeCat,1000)
    this.handleOndragStart = this.handleOndragStart.bind(this);
  }
  handleOndragStart =(e,data)=>{
    e.dataTransfer.setData("key","insert");
    let item=utis.deepCopy(data);
    item.icon=undefined;
    e.dataTransfer.setData("item",JSON.stringify(item));
    e.dataTransfer.setDragImage(img, 0, 0)
  }
  changeCat=(val)=>{
    this.setState({
      catArr:cats.map(v=>{
        return {...v,data:v.data.filter(v1=>{
          if(!val){
            return true;
          }
          return v1.nameSpace.includes(val)||v1.title.includes(val)
        })}
      })
    })
  }
  
  render() {
    return (
      <div className="components">
          <Search
            size={"small"}
            placeholder="关键词搜索组件库"
            onChange={(e) =>{
              this.changeCat(e.target.value)
            }}
            style={{ width: 200 }}
          />
          <div>
            {
              this.state.catArr.map((v,i1)=>{
                return <ul key={"catUl"+i1}>
                  <div className="catTitle">
                    {v.name}
                  </div>
                  {
                    // eslint-disable-next-line no-mixed-operators
                    (Array.isArray(v.data) && v.data || []).map((v,i)=>{
                      // eslint-disable-next-line no-useless-concat
                      return <li key={"li" + "-"+i1+"-"+i} className="catLi">
                        <div draggable="true"  onDragStart={(e)=>{
                          e.stopPropagation();
                          // setDragImage(img, xOffset, yOffset)
                          this.handleOndragStart(e,v)
                        }} >
                         {
                           // eslint-disable-next-line no-mixed-operators
                           v.icon&&<span className={"iconfont "+v.icon}></span>
                         } {v.title}
                        </div>
                      </li>
                    })
                  }
                </ul>
              })
            }
          </div>
      </div>
    )
  }
}


