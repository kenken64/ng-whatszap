import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { SentimentService } from '../../services/sentiment.service';

import { MatSnackBar } from '@angular/material';
import { Guid } from '../../shared/util';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from '../../../environments/environment';

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
    public storage: AngularFireStorage,
    public sentimentSvc: SentimentService) { 
  }

  ngOnInit() {
    this.chatSvc.getUserName().subscribe((result)=>{
      this.name = result;
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
    this.mediaRecorder.stop();
    window.localStream.getAudioTracks()[0].stop();
    this.isRecording = false;
  }

  onMessage(){
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
          this.sentimentSvc.addMessage(chatMessage).subscribe((result)=>{
            console.log(result);
          })
          this.messageValue = "";
        });
      }else{
        this.snackBar.open("Kindly, please input a chat message.", "Done", {
          duration: 3500,
        });
      }
      
    }else{
      this.snackBar.open("Please enter your name, refresh this page.", "Done", {
        duration: 3500,
      });
    }
  }

  // function as expression this works!
  audioIsAvailable = e =>{
    let id = Guid.newGuid();
    const filePath = `${id}.webm`;
    console.log(filePath);
    let chatMessage = {
      message_type: 4,
      message: null,
      message_date: new Date(),
      from: this.name,
      audioUrl: environment.firebase_cms_url + filePath  + environment.firebase_cms_url_postfix,
    }
    this.chatSvc.sendMessage(chatMessage).subscribe((result)=>{
      console.log(result);
      const task = this.storage.upload(filePath, e.data);
    });
  }
}