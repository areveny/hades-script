import React from 'react';
import axios from 'axios';
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
    this.setState({ 'results': new Array<Result>()}, () => {
      axios.post('http://localhost:4000/',
        {'selectedSpeakers': Array.from(this.props.selectedSpeakers), 
          'matchString': this.props.matchString},
        { headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          this.setState({ 'results': response.data })
        })
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
      <div className='display'>
        {this.state.results.map((result: Result) => {
          return (
            <div key={result.line_name}>
              <span className='speakerName' key={result.line_name + '-' + result.speaker}>{result.speaker}</span>
              <span className='conversationName' key={result.line_name + '-' + result.conversation_name}>{result.conversation_name}</span>
              <br />
              <div className='text' key={result.line_name + '-container'}>{convertFormatting(result.text, result.line_name)}</div>
            </div>
          )
        })}
      </div>
    );
  }
}

function convertFormatting(line: string, line_name: string) {
  var formatStart = line.indexOf('{#DialogueItalicFormat}')
  var output = [];
  var index = 0;
  while (formatStart !== -1) {
    var before = line.substring(0, formatStart)
    var formatCloseStart = line.indexOf('{#PreviousFormat}')
    if (formatCloseStart === -1) {
      output.push(<i key={index}>{line.substring(formatStart + 23)}</i>)
      line = ''
      break
    }
    var formatted = line.substring(formatStart + 23, formatCloseStart)
    output.push(before)
    output.push(<i key={index}>{formatted}</i>)

      index = index + 1
      line = line.substring(formatCloseStart + 17)
      formatStart = line.indexOf('{#DialogueItalicFormat}')
    }
    output.push(line)
    return React.createElement('p', { 'className': 'text-element', 'key': line_name + '-text'}, output)
  }


export default Display; 
export {convertFormatting};