
import { catchError }                       from 'rxjs/operators';
import { throwError as observableThrowError,  Observable } from 'rxjs';
import { Component }                        from '@angular/core';

import { HttpClient }                       from '@angular/common/http';
import { HttpErrorResponse }                from '@angular/common/http';
import { map }                              from 'rxjs/operators';
import { HTTPProducerConsumerService }      from './producerconsumer.service';
import { NgZone }                           from '@angular/core';
import { publish }                          from 'rxjs/operators';
import { tap }                              from 'rxjs/operators';
import { WebSocketSubject }                 from 'rxjs/webSocket';
import { webSocket }                        from 'rxjs/webSocket';

interface WebWorkerMessage {
  type: string;
  payload: any;
  id?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {

  get_url = 'http://notify.example.com/sub';
  post_url = 'http://notify.example.com/pub';
  sock_url = 'wss://notify.example.com/sub';
  title = 'Websocket Producer => Consumer App';
  sock : WebSocketSubject<any> = undefined;
  ws$ : Observable<any> = undefined;


  static messageid: number = 1;


  private _nextMessageId : number = 0;





  public constructor (private http: HttpClient,
    private producer: HTTPProducerConsumerService,
    private zone : NgZone) {

    this.sock = webSocket (this.sock_url);
    this.ws$ = this.sock.pipe (
        publish(),
        map (x => x.connect().subscribe(
          (val) =>  console.log ('CONSUMED ' + val),
          (err) => console.log ('CONSUMER ERR ' + JSON.stringify(err)),
          () => console.log ('CONSUMER ()')
        )),
        tap (val => console.log ('Connected'))
      );
  }


  public reset () {

    this.producer.reset ()
      .subscribe (
        (val) =>  console.log ('DELETED'),
        (err) => console.log ('DELETE ERR'),
        () => {
          console.log ('DELETE ()');
        }
      )

    AppComponent.messageid = 1;
  }


  public http_produce () {

    this.producer.produce(AppComponent.messageid)
      .subscribe (
        (val) =>  console.log ('POSTED ' + val),
        (err) => console.log ('POST ERR'),
        () => console.log ('PRODUCER ()')
      )

    AppComponent.messageid++;
  }

  public http_consume () {

    this.http.get<string>(this.get_url)
      .pipe(
        catchError(this.handleError)
      )
      .subscribe (
        (val) =>  console.log ('CONSUMED ' + val),
        (err) => console.log ('CONSUMER ERR ' + JSON.stringify(err)),
        () => console.log ('CONSUMER ()')
      )
  }

  public spawn_worker () {
      let _self = this;
      let worker_url : string = '/webworkers/worker.js';
      let w : Worker = new Worker (worker_url);

      const id = this._nextMessageId++;

      const onMessage = (response : MessageEvent) => {
        const {type: responseType, id: responseId, payload: responsePayload} = response.data as WebWorkerMessage;
        if (responseType === 'error' && id  === responseId) {
           _self.zone.run (() => {
              console.log ('Application error received from worker in main thread. Notifying subscriber');
              console.error (JSON.stringify(responsePayload));
              w.terminate();
            });
        }
        else if (responseType === 'PONG' && id === responseId) {
          _self.zone.run(() => {
            console.log (responsePayload);
            w.terminate();
          });
        }
      }

      const onError = (error : ErrorEvent) => {
        console.log ('Web worker client has received an error from worker');
        _self.zone.run (() => {
          console.error (error.message);
          w.terminate();
        });
      }

      w.addEventListener('message', onMessage);
      w.addEventListener('error', onError);
      w.postMessage ({type: 'PING', id: id, payload: 'test'});
  }




  public wss_consume () {
    this.ws$.subscribe (
      (value) => console.log ('SOCKET VALUE => ' + value),
      (error) => console.log ('SOCKET ERROR => ' + error),
      () => console.log ('SOCKET ()')
    );
  }

  public wss_produce() {

  }

  private handleError (error: HttpErrorResponse | any) {
    return observableThrowError(error);
  }
}
