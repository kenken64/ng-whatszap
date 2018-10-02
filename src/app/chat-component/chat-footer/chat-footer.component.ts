import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { MatSnackBar } from '@angular/material';
import { RecordRTC }  from 'recordrtc';

@Component({
  selector: 'app-chat-footer',
  templateUrl: './chat-footer.component.html',
  styleUrls: ['./chat-footer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatFooterComponent implements OnInit {
  messageValue: String= "";
  name: string = null;
  changeToListenMode: boolean = false;
  private stream: MediaStream;
  private recordRTC: any;
  
  constructor(private chatSvc: ChatService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.chatSvc.getUserName().subscribe((result)=>{
      console.log("ChatFooterComponent" + result);
      this.name = result;
      console.log(this.name);
    });
  }


  onMic(){
    var options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
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
