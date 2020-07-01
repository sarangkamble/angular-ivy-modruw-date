import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { DateComponent } from './date/date.component';
import { Date1Component } from './date1/date1.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, HelloComponent, DateComponent, Date1Component ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
