import React from 'react';
import './App.css';

class Search extends React.Component {

  speakers = ["Artemis", "Zagreus", "Zeus", "Athena", "Aphrodite", "Ares", "Hades", "Demeter"]
  selectedSpeakers = new Set()
  toggle: {[key: string]: boolean} = {};

  selectSpeaker = (e: React.MouseEvent) => {
      var speaker = (e.currentTarget as HTMLButtonElement).value
      if (this.selectedSpeakers.has(speaker)) {
        this.selectedSpeakers.delete(speaker)
      } else {
        this.selectedSpeakers.add(speaker)
      }
      this.toggle[speaker] = !this.toggle[speaker]
      console.log(this.selectedSpeakers)
  }


    render() {
      return (
        <div className="App">
            {this.speakers.map((speaker: string) => {
            return <button className="speaker-select" key={speaker} value={speaker} onClick={this.selectSpeaker}>
              {speaker}
            </button>
          })}
        </div>
      );
    }
  }

export default Search;
