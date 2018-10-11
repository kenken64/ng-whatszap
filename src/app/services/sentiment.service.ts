import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SentimentService {

  constructor(private http: HttpClient) { }

  addMessage(chatMessage: any){
    return this.http.get(`${environment.sentiment_api}/add?text=${chatMessage.message}&fromWho=${chatMessage.from}`);
  }

  getAllAnalyzedMessages(): Observable<any>{
    return this.http.get(`${environment.sentiment_api}/getAllSentiment`);
  }
}
