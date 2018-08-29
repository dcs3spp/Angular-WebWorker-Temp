import { AppComponent }                         from './app.component';
import { BrowserAnimationsModule }              from '@angular/platform-browser/animations';
import { BrowserModule }                        from '@angular/platform-browser';
import { HttpClientModule }                     from '@angular/common/http';
import { HttpClient }                           from '@angular/common/http';
import { HTTPProducerConsumerService }          from './producerconsumer.service';
import { MatButtonModule, MatCheckboxModule }   from '@angular/material';
import { NgModule }                             from '@angular/core';


// import 'moment/moment.js';
// import 'fullcalendar/dist/fullcalendar.js';
import { ScheduleModule }                       from 'primeng/primeng';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    ScheduleModule,
  ],
  providers: [
    HttpClient,
    HTTPProducerConsumerService
  ],
  bootstrap: [AppComponent]
})



export class AppModule { }
