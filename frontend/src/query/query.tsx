import React from 'react';
import Display from './display/display';
import './query.css';

const speakers = ["Artemis", "Zagreus", "Zeus", "Athena", "Aphrodite", "Ares", "Hades", "Demeter"]
const colors: {[key: string]: string} = {"Artemis": "green",
                                      "Zagreus": "red"
  };

class Query extends React.Component<any, any> {

  selectedSpeakers = new Set()

  constructor(props: any) {
    super(props)
    this.state = {"query": this.getQuery()}
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
      if (this.selectedSpeakers.has(speaker)) {
        this.selectedSpeakers.delete(speaker)
        element.style.removeProperty("background-color")
      } else {
        element.style.backgroundColor = this.getColor(speaker)
        this.selectedSpeakers.add(speaker)
      }
      this.updateQuery()
      console.log(this.selectedSpeakers)
  }

  getQuery = () => {
    var filters = Array.from(this.selectedSpeakers).join(" OR  ")
    console.log(filters)
    return `SELECT * FROM lines AND ${filters}`
  }

  updateQuery = () => {
    this.setState({"query": this.getQuery()})
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
        <Display query={this.state.query} />
      </div>
    );
  }
}

export default Query;
