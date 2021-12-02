import { Component, OnInit, Query } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { distinct } from 'rxjs';
import { QueryService, TextLine, TextLines} from './query.service'; 

// https://angular.io/tutorial
@Component({
  selector: 'search-app',
  // template: '<h1>{{ title }}</h1><p>Hello.</p>',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  speakers = ["Artemis", "Zagreus", "Zeus", "Athena", "Aphrodite", "Ares", "Hades", "Demeter"]
  title = 'frontend';
  textLines: TextLine[] = [];
  display: string = ""
  selectedSpeakers = new Set()
  toggle: {[key: string]: boolean} = {};
  colors: {[key: string]: string} = {"Artemis": "green",
                                      "Zagreus": "red"
  };
  

  queryForm = new FormControl("")

  constructor(private queryService: QueryService) {
    for (var speaker in this.speakers) {
      this.toggle[speaker] = false
    }
  }

  getTextLines() {
      this.queryService.runQuery()
        .subscribe((textLines: TextLine[]) => {
          this.textLines = textLines
          this.display = this.textLines[0].speaker
        })
      return this.textLines
  }

  onSpeakerSelection(speaker: string) {
    if (this.selectedSpeakers.has(speaker)) {
      this.selectedSpeakers.delete(speaker)
    } else {
      this.selectedSpeakers.add(speaker)
    }
    this.toggle[speaker] = !this.toggle[speaker]
    console.log(this.selectedSpeakers)
  }

  getColor(speaker: string) {
    if (speaker in this.colors) {
      return this.colors[speaker]
    } else {
      return "black";
    }
  }

  ngOnInit(): void {
    this.getTextLines()
  }

}

