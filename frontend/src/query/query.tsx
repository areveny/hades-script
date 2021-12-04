import React from 'react';
import Display from './display/display';
import './query.css';

const speakers = ["Artemis", "Zagreus", "Zeus", "Athena", "Aphrodite", "Ares", "Hades", "Demeter"]
const colors: {[key: string]: string} = {"Artemis": "green",
                                      "Zagreus": "red"
  };

interface QueryState {
  selectedSpeakers: Set<string>
}

class Query extends React.Component<any, QueryState> {

  selectedSpeakers = new Set()

  constructor(props: any) {
    super(props)
    this.state = {"selectedSpeakers": new Set<string>()}
  }

  getColor(speaker: string) {
    if (speaker in colors) {
      return colors[speaker]
    } else {
      return "black";
    }
  }

  selectSpeaker = (e: React.MouseEvent) => {
      var element = (e.currentTarget as HTMLButtonElement)
      var speaker = element.value
      var clonedMap = new Set<string>(this.state.selectedSpeakers)
      if (clonedMap.has(speaker)) {
        clonedMap.delete(speaker)
        element.style.removeProperty("background-color")
      } else {
        element.style.backgroundColor = this.getColor(speaker)
        clonedMap.add(speaker)
      }
      this.setState({"selectedSpeakers": clonedMap})
      console.log(this.state.selectedSpeakers)
  }

  render() {
    return (
      <div className="query">
        <div className="selectors">
          {speakers.map((speaker: string) => {
            return <button className="speaker-select"
              key={speaker} value={speaker}
              onClick={this.selectSpeaker}>
              {speaker}
            </button>
          })}
        </div>
        <Display selectedSpeakers={this.state.selectedSpeakers} />
      </div>
    );
  }
}

export default Query;
