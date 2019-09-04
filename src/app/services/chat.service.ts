import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of} from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import { ChatMessage } from '../model/chat-message';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public userdata: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private chatsCollection: AngularFirestoreCollection<ChatMessage>;

  constructor(db: AngularFirestore, private httpClient: HttpClient) {
    this.chatsCollection = db.collection<ChatMessage>('chats', ref => ref.orderBy('message_date', 'asc'));
   }

  setName(name){
    this.userdata.next(name);
  }

  getUserName(): Observable<any>{
    return this.userdata.asObservable();
  }

  getAllChatMessages(): Observable<ChatMessage[]>{
    return this.chatsCollection.valueChanges();
  }

  sendMessage(chatMessage) {
    return of(this.chatsCollection.add(chatMessage));
  }

  getImageToken(imagePath:string){
    console.log(imagePath);
    const params = new HttpParams();
    return(
      this.httpClient.get(`${environment.firebase_cms_url}${imagePath}`
      , {params: params})
      .toPromise()
    );
  }
}
