import React from 'react';
import './display.css';

class Display extends React.Component<any, any> {

  render() { return (
    <div className="display">
      <p>{this.props.query}</p>
    </div>
  );}
}

export default Display;