import React from 'react';
import { getByText } from '@testing-library/react';
import { Fragment } from 'react/cjs/react.development';

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.state=props.state;

  }
  
  handleChange=(key,value)=>{
      
  }
  componentWillReceiveProps(props){
    this.setState({
        ...props.state
    })
  }
  getText=()=>{
    try{
        let str=this.props.data.state.text.indexOf("{{")>=0? new Function("return "+this.props.data.state.text.replace(/\{|\}/gi,"")).bind(this)() :this.props.data.state.text;
        return String(str)
    }catch(e){
        return "文本"
    }
  }
  render() {
    return (
        <Fragment>
            <span className="span"  >
                {
                     this.props.text
                }
                 -----
                {
                  this.props.keyStr
                }
            </span>
           
        </Fragment>
    )
  }
}


