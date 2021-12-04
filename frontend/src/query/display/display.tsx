import React from 'react';
import axios from 'axios';
import './display.css';

interface DisplayProps {
  selectedSpeakers: Set<string>;
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

  addsStuffQuery = () => {
    this.setState({ "result": "" }, () => {
      axios.post("http://localhost:4000/",
        Array.from(this.props.selectedSpeakers),
        { headers: { "Content-Type": "application/json" } })
        .then((response) => {
          this.setState({ "result": response.data })
        })
    })
  }

  getQuery = () => {
    var filters = "";
    if (this.props.selectedSpeakers.size > 0) {
      filters = " AND ".concat(Array.from(this.props.selectedSpeakers).join(" OR  "))
    } 
    return `SELECT * FROM lines${filters};`
  }

  componentDidUpdate(prevProps: DisplayProps) {
    if (this.props.selectedSpeakers !== prevProps.selectedSpeakers) {
      this.addsStuffQuery()
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