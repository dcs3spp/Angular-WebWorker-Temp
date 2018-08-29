import { AppComponent }                         from './app.component';
import { BrowserAnimationsModule }              from '@angular/platform-browser/animations';
import { BrowserModule }                        from '@angular/platform-browser';
import { HttpClientModule }                     from '@angular/common/http';
import { HttpClient }                           from '@angular/common/http';
import { HTTPProducerConsumerService }          from './producerconsumer.service';
import {
         MatButtonModule,
         MatCheckboxModule,
       }                                        from '@angular/material';
import { MatExpansionModule}                    from '@angular/material/expansion';
import { MatListModule }                        from '@angular/material/list';
import { NgModule }                             from '@angular/core';
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
    MatExpansionModule,
    MatListModule,
    ScheduleModule,
  ],
  providers: [
    HttpClient,
    HTTPProducerConsumerService
  ],
  bootstrap: [AppComponent]
})



export class AppModule { }
