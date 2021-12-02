import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { SearchComponent } from './search.component';
import { QueryService } from './query.service';
import { DisplayComponent } from './display/display.component';

@NgModule({
  declarations: [
    SearchComponent,
    DisplayComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatButtonToggleModule
  ],
  providers: [QueryService],
  bootstrap: [SearchComponent]
})
export class SearchModule { }
