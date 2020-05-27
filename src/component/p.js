import React from 'react';

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange=(key,value)=>{
      
  }
  
  render() {
    return (
      <p className="p" id={this.props.keys}  key={this.props.keys}>
        我是p
        {this.props.children}
      </p>
    )
  }
}


