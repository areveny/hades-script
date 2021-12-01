import { Component, OnInit, Query } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { QueryService, TextLine, TextLines} from './query.service'; 

// https://angular.io/tutorial
@Component({
  selector: 'search-app',
  // template: '<h1>{{ title }}</h1><p>Hello.</p>',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  speakers = ["Artemis", "Zagreus"]
  title = 'frontend';
  textLines: TextLine[] = [];
  display: string = ""
  selectedSpeakers = new Set()

  queryForm = new FormControl("")

  constructor(private queryService: QueryService) { }

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
    console.log(this.selectedSpeakers)
  }

  ngOnInit(): void {
    this.getTextLines()
  }

}

