import { Component, OnInit} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.css']
})


export class ChatHeaderComponent implements OnInit {
  name: string = "";
  
  constructor(private chatSvc: ChatService,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.chatSvc.getUserName().subscribe((result)=>{
      console.log("ChatHeaderComponent" + result);
      this.name = result;
    });
  }

  onCamera(){
    //TODO webcam ....
  }

  onChange(files, event) {
    var id = Guid.newGuid();
    console.log( files );
    console.log( event.target.files[0].name );
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const filePath = `${id}_${event.target.files[0].name}`;
    const task = this.storage.upload(filePath, file);
    console.log(task);
    let chatMessage = {
      message_type: 2,
      message: null,
      message_date: new Date(),
      from: this.name,
      imageUrl: `https://firebasestorage.googleapis.com/v0/b/chat-app-acea7.appspot.com/o/${filePath}?alt=media&token=0bb313a8-2b7b-4b59-af44-5e1044376e0e`,
    }
    this.chatSvc.sendMessage(chatMessage).subscribe((result)=>{
      console.log(result);
    });
  }
}

class Guid {
  static newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
  }
}

