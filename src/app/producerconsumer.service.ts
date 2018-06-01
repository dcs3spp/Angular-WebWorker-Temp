import { HttpHeaders }                          from '@angular/common/http';
import { HttpClient }                           from '@angular/common/http';
import { HttpResponse }                         from '@angular/common/http';
import { HttpErrorResponse }                    from '@angular/common/http';

import { Injectable }                           from '@angular/core';

import { catchError }                           from 'rxjs/operators';
import { map }                                  from 'rxjs/operators';
import { throwError as observableThrowError }   from 'rxjs';
import { Observable }                           from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HTTPProducerConsumerService {

  private PRODUCER_URL : string = 'http://notify.example.com/pub';
  private CONSUMER_URL : string = 'http://notify.example.com/sub';


  constructor (private http: HttpClient) {}


  public produce (messageid: number):Observable<string> {

    return this.http.post<string>(this.PRODUCER_URL, JSON.stringify('message ' + messageid))
                .pipe (
                  catchError(this.handleError)
                )

  }


  public consume ():Observable<string> {

    return this.http.get<string>(this.CONSUMER_URL)
      .pipe(
        catchError(this.handleError)
      )
  }


  public reset ():Observable<string> {

    return this.http.delete<string>(this.PRODUCER_URL)
      .pipe(
        catchError(this.handleError)
      )
  }



  private handleError (error: HttpErrorResponse | any) {
    return observableThrowError(error);
  }

}
