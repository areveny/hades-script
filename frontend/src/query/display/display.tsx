import React from 'react';
import axios from 'axios';
import LinesDisplay from '../../linesDisplay/linesDisplay';
import Result from '../../models/models';
import './display.css';

interface DisplayProps {
  selectedSpeakers: Set<string>;
  matchString: string;
}

interface DisplayState {
  results: Result[];
}

// https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
class Display extends React.Component<DisplayProps, DisplayState> {

  constructor(props: DisplayProps) {
    super(props)
    this.state = { 'results': new Array<Result>()}
  }

  addsStuffQuery = () => {
      axios.post('http://localhost:4000/',
        {'selectedSpeakers': Array.from(this.props.selectedSpeakers), 
          'matchString': this.props.matchString},
        { headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          this.setState({ 'results': response.data })
        })
  }

  componentDidUpdate(prevProps: DisplayProps) {
    if ((this.props.selectedSpeakers !== prevProps.selectedSpeakers &&
        this.props.selectedSpeakers.size > 0) ||
        (this.props.matchString !== prevProps.matchString && this.props.matchString !== '')
     ) {
      this.addsStuffQuery()
    }
  }

  render() {
    return (
      <LinesDisplay lines={this.state.results} />
    )
  }
}

export default Display; 