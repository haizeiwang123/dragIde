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
      <div className="page">
        {this.props.children}
      </div>
    )
  }
}


