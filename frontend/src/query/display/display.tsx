import React from 'react';
import './display.css';
import axios from 'axios';

// https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
class Display extends React.PureComponent<any, any> {

  constructor(props: any) {
    super(props)
    this.state = {"result": ""}
  }

  addsStuffQuery = (query: string) => {
    // return "asd".concat(query, "bsdf");
    console.log("Sent query", query)
    var body = { "query": query };
    var result = axios.post("http://localhost:4000/",
      body,
      { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        console.log("Response", response.data)
        this.setState({"result": response.data})
      })
    return result
  }

  render() { 
    console.log("Redner")
    this.addsStuffQuery(this.props.query)
    return (
    <div className="display">
      {/* <p>{this.addsStuffQuery(this.props.query)}</p> */}
      <p>{this.state.result}</p>
    </div>
  );}
}

export default Display;