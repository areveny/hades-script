import React from 'react';
import './display.css';
import axios from 'axios';

interface DisplayProps {
  query: string;
}

interface DisplayState {
  result: string;
}

// https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
class Display extends React.PureComponent<DisplayProps, DisplayState> {

  constructor(props: DisplayProps) {
    super(props)
    this.state = { "result": "" }
  }

  addsStuffQuery = (query: string) => {
    var body = { "query": query };
    this.setState({ "result": "" }, () => {
      axios.post("http://localhost:4000/",
        body,
        { headers: { "Content-Type": "application/json" } })
        .then((response) => {
          this.setState({ "result": response.data })
        })
    })
  }

  componentDidUpdate(prevProps: DisplayProps) {
    if (this.props.query !== prevProps.query) {
      this.addsStuffQuery(this.props.query)
    }
  }

  render() {
    return (
      <div className="display">
        <p>{this.state.result}</p>
      </div>
    );
  }
}

export default Display;