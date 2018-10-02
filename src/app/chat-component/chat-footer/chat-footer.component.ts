import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { MatSnackBar } from '@angular/material';
import { Guid } from '../../shared/util';
import * as firebase from 'firebase';
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
    private _ngZone: NgZone) { 
      window.angularComponent = {saveToFireStorage: this.saveToFireStorage, zone: _ngZone};
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
        this.mediaRecorder.ondataavailable = audioIsHere;
        this.mediaRecorder.onstop = recordStopLah;
        this.mediaRecorder.start();
        this.isRecording = true;
    });
  }

  saveToFireStorage(e){
    console.log("save to fire storage !" + JSON.stringify(e));
    let id = Guid.newGuid();
    console.log(id);
    const filePath = `${id}.webm`;
    var storageRef = firebase.storage().ref();
    var audioCaptureRef = storageRef.child(filePath);
    audioCaptureRef.put(e.data).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
      console.log(snapshot);
    });
  }

  onStopRecord(){
    console.log("stopping !");
    this.mediaRecorder.stop();
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

function audioIsHere(e){
  console.log(e);
  window.angularComponent.saveToFireStorage(e);  
}

function recordStopLah(e){
  console.log(e);
  console.log("recordStopLah");
}