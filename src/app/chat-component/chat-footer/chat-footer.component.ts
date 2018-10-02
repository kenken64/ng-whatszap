import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { MatSnackBar } from '@angular/material';
import { Guid } from '../../shared/util';
import { AngularFireStorage } from '@angular/fire/storage';

declare var MediaRecorder: any;
declare var window: any;

@Component({
  selector: 'app-chat-footer',
  templateUrl: './chat-footer.component.html',
  styleUrls: ['./chat-footer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatFooterComponent implements OnInit {
  
  messageValue: String= "";
  name: string = null;
  isRecording: boolean = false;
  mediaRecorder: any;
  
  constructor(private chatSvc: ChatService, 
    public snackBar: MatSnackBar,
    public storage: AngularFireStorage) { 
  }

  ngOnInit() {
    this.chatSvc.getUserName().subscribe((result)=>{
      console.log("ChatFooterComponent" + result);
      this.name = result;
      console.log(this.name);
    });
  }

  onStartRecord(){
    navigator.mediaDevices.getUserMedia({audio: true}).
      then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = this.audioIsAvailable;
        window.localStream = stream;
        this.mediaRecorder.start();
        this.isRecording = true;
    });
  }

  onStopRecord(){
    console.log("stopping !");
    this.mediaRecorder.stop();
    window.localStream.getAudioTracks()[0].stop();
    console.log(this.mediaRecorder.state);
    this.isRecording = false;
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
          webcamUrl: null,
          audioUrl: null
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
  
  audioIsAvailable = e =>{
    console.log(e);
    console.log("save to fire storage !" + JSON.stringify(e));
    let id = Guid.newGuid();
    console.log(id);
    const filePath = `${id}.webm`;
    console.log(this.storage);
    const task = this.storage.upload(filePath, e.data);
  }
}