
import { Component }                        from '@angular/core';
import { ScheduleModule }                   from 'primeng/primeng';
import { NgZone }                           from '@angular/core';

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

  static messageid: number = 1;
  private _nextMessageId : number = 0;

  defaultDate: Date;
  events: any[];
  headerConfig: any;
  messages: any[];
  panelOpenState = false;
  title = 'Angular Scratch Apps';
  panelWebWorkerState = false;

  public constructor (private zone : NgZone) {
    this.messages = [];
  }


  public reset () {
    console.log ("reset() => clearing web worker messages received");
    this.messages = [];
    AppComponent.messageid = 1;
  }

  public spawn_worker () {
      console.log ("spawn_worker() => trying to spawn webworker and echo messages received");
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
            _self.messages.push (JSON.stringify(responsePayload));
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

}
