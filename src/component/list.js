
import React from 'react';
import {Input, Drawer,Button, Switch,Radio,Table } from 'antd';

 
export default class App extends React.Component{
  constructor(props) {
    super(props)
    console.log(props)
    this.state={
        selectedRowKeys: [], // Check here to configure the default column
        data:(Array.isArray(props.data)?props.data:[]).map((v,i)=>{
            return {...v,key:i}
        })
    };
  }
  columns=[
    {
      title: '选项标签名',
      render:(arr,record,index)=>{
        return <Input value={record.label} onChange={(e)=>{this.handleChange(index,"label",e.target.value)}} />
      }
    },
    {
      title: '选项值',
      render:(arr,record,index)=>{
        return <Input onChange={(e)=>{this.handleChange(index,"value",e.target.value)}}  value={record.value} />
      }
    },
    {
      title: '是否禁用',
      dataIndex: 'disabled',
      width:"100px",
      render:(arr,record,index)=>{
        return <Switch onChange={(checked)=>{this.handleChange(index,"disabled",checked)}}  checked={record.disabled} />
      }
    },
  ]
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  handleChange=(index,type,value)=>{
    this.setState({
        data:this.state.data.map((v,i)=>{
            if(i===index){
                v[type]=value
            }
            return {
                ...v
            }
        })
    })
  }

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
        <Drawer
        title={"属性编辑"}
        placement="right"
        width="560"
        closable={false}
        visible={this.props.arrDia}
        footer={
          <div style={{textAlign: 'right'}}>
            <Radio.Group size={"small"} style={{float:"left","marginTop":"6px"}}>
                <Radio.Button value="top" 
                 onClick={()=>{
                    let data= [...this.state.data];
                    if(this.state.selectedRowKeys.length!==1)return ;
                    let index=this.state.selectedRowKeys[0];
                    if(parseInt(index)===0) return ;
                    let now={...data[index]};
                    let last={...data[index-1]}
                    data[index]={...last,key:index};
                    data[index-1]={...now,key:index-1};
                    this.setState({
                        data:[...data],
                        selectedRowKeys:[index-1]
                    })
                }}
                >上移</Radio.Button>
                <Radio.Button value="bottom" 
                    onClick={()=>{
                        let data= [...this.state.data];
                        if(this.state.selectedRowKeys.length!==1)return ;
                        let index=this.state.selectedRowKeys[0];
                        if(parseInt(index)===(data.length-1)) return ;
                        let now={...data[index]};
                        let last={...data[index+1]}
                        data[index]={...last,key:index};
                        data[index+1]={...now,key:index+1};
                        this.setState({
                            data:[...data],
                            selectedRowKeys:[index+1]
                        })
                    }}
                >下移</Radio.Button>
                <Radio.Button type="primary" onClick={()=>{
                    this.setState({
                        data:[...this.state.data,{
                            key:this.state.data.length,
                            label: ``,
                            value: "",
                            disabled: false,}]
                    })
                }} value="add">添加</Radio.Button>
                <Radio.Button value="del"  onClick={()=>{
                    this.setState({
                        data:this.state.data.filter((v,i)=>{
                            return !this.state.selectedRowKeys.includes(i)
                        })
                    })
                }}
                >删除</Radio.Button>
            </Radio.Group>
            <Button type="primary" style={{ marginRight: "10px" }} onClick={() => { this.props.comfirm(this.state.data);this.props.hide() }}>确定</Button>
            <Button onClick={() => { this.props.hide() }}>取消</Button>
          </div>
        }
      >
        <Table rowSelection={rowSelection} pagination={false} columns={this.columns} dataSource={this.state.data}>
            
        </Table>
  
      </Drawer>
    )
  }
}




