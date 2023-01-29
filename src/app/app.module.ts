import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import { SlideComponent } from './components/slide/slide.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    SlideComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
