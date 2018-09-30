import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-chat-footer',
  templateUrl: './chat-footer.component.html',
  styleUrls: ['./chat-footer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatFooterComponent implements OnInit {
  messageValue: String= "";
  name: string = null;

  constructor(private chatSvc: ChatService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.chatSvc.getUserName().subscribe((result)=>{
      console.log("ChatFooterComponent" + result);
      this.name = result;
      console.log(this.name);
    });
  }


  onMic(){

  }

  onMessage(){
    console.log("message > " + this.messageValue);
    console.log("message > " + this.name);
    if(typeof(this.name) !== 'undefined'){
      
      if(this.messageValue !== ''){
        let chatMessage = {
          message_type: 1,
          message: this.messageValue,
          message_date: new Date(),
          from: this.name,
          imageUrl: null,
    
        }
        this.chatSvc.sendMessage(chatMessage).subscribe((result)=>{
          console.log(result);
          this.messageValue = "";
        });
      }else{
        console.log("messageValue is empty" + this.messageValue);
        this.snackBar.open("Kindly, please input a chat message.", "Done", {
          duration: 3500,
        });
      }
      
    }else{
      console.log("name is null" + this.name);
      this.snackBar.open("Please enter your name, refresh this page.", "Done", {
        duration: 3500,
      });
    }
    
  }
}
