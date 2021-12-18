import React from 'react';
import axios from 'axios';
import './display.css';

interface DisplayProps {
  selectedSpeakers: Set<string>;
}

interface DisplayState {
  results: Result[];
}

interface Result {
  line_name: string;
  conversation: string;
  speaker: string;
  text: string;
}

// https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
class Display extends React.PureComponent<DisplayProps, DisplayState> {

  constructor(props: DisplayProps) {
    super(props)
    this.state = { 'results': new Array<Result>()}
  }

  addsStuffQuery = () => {
    this.setState({ 'results': new Array<Result>()}, () => {
      axios.post('http://localhost:4000/',
        {'selectedSpeakers': Array.from(this.props.selectedSpeakers)},
        { headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          console.log(response.data)
          this.setState({ 'results': response.data })
        })
    })
  }

  componentDidUpdate(prevProps: DisplayProps) {
    if (this.props.selectedSpeakers !== prevProps.selectedSpeakers &&
        this.props.selectedSpeakers.size > 0) {
      this.addsStuffQuery()
    }
  }

  convertFormatting = (line: string) => {
    // "I {#DialogueItalicFormat}do {#PreviousFormat}have feelings for you, silly! That's what I've been trying to tell you, it's just... it's just...".indexOf('{#DialogueItalicFormat}')
    var formatStart = line.indexOf('{#DialogueItalicFormat}')
    var output = new Array();
    while (formatStart !== -1) {
      var before = line.substring(0, formatStart)
      var formatCloseStart = line.indexOf('{#PreviousFormat}')
      var formatted = line.substring(formatStart + 23, formatCloseStart)
      output.push(before)
      output.push(<i>{formatted}</i>)

      var line = line.substring(formatCloseStart + 17)
      var formatStart = line.indexOf('{#DialogueItalicFormat}')
    }
    output.push(line)
    return React.createElement('p', { 'className': 'text' }, output)
    // return line.replaceAll('{#DialogueItalicFormat}', '<i>').replaceAll('{#PreviousFormat}', '</i>')
  }

  render() {
    return (
      <div className='display'>
        {this.state.results.map((result: Result) => {
          return (
            <div key={result.line_name.concat('-speaker')}>
              <p className='speakerName' key={result.line_name + '-' + result.speaker}>{result.speaker}</p>
              <p key={result.line_name}>{this.convertFormatting(result.text)}</p>
            </div>
          )
        })}
      </div>
    );
  }
}

export default Display;