import { Component, OnInit, Query } from '@angular/core';
import { QueryService, TextLine, TextLines} from './query.service'; 

// https://angular.io/tutorial
@Component({
  selector: 'app-root',
  // template: '<h1>{{ title }}</h1><p>Hello.</p>',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  textLines: TextLine[] = [];
  display: string = ""

  constructor(private queryService: QueryService) { }

  getTextLines() {
      this.queryService.runQuery()
        .subscribe((textLines: TextLine[]) => {
          this.textLines = textLines
          this.display = this.textLines[0].speaker
        })
      return this.textLines
  }

  ngOnInit(): void {
    this.getTextLines()
  }

}

