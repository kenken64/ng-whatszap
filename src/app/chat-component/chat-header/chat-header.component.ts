import { Component, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { WebCamComponent } from 'ack-angular-webcam';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface WebcamDialogData {
  name: string;
}

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.css']
})

export class ChatHeaderComponent implements OnInit {
  name: string = "";
  imageBinary: any;
  @Output() success = new EventEmitter()
  @Output() catch = new EventEmitter()

  constructor(public chatSvc: ChatService,
    public storage: AngularFireStorage, 
    public dialog: MatDialog,
    private route : Router) { }

  ngOnInit() {
    this.chatSvc.getUserName().subscribe((result)=>{
      console.log("ChatHeaderComponent" + result);
      this.name = result;
    });
  } 

  onVideoCall(){
    this.route.navigate(['/video-call']);
  }

  onSentiment(){
    this.route.navigate(['/sentiment']);
  }

  onCamera(){
    setTimeout(() => {
      const dialogRef = this.dialog.open(WebcamDialog, {
        height: '480px',
        width: '640px',
        data: {name: this.name}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if(typeof(result) === 'undefined'){
          this.chatSvc.getUserName().subscribe((result)=>{
            this.name = result;
            console.log("ChatHeaderComponent this.name" + this.name);
          });
        }else{
          this.name = result;
        }
        console.log('The dialog was closed ' + this.name);
      });
    });
  }

  onChange(files, event) {
    let id = Guid.newGuid();
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
      imageUrl: environment.firebase_cms_url + filePath  + environment.firebase_cms_url_postfix,
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

@Component({
  selector: 'webcam-dialog',
  templateUrl: 'webcam.dialog.html',
  styleUrls: ['./chat-header.component.css']
})
export class WebcamDialog {
  webcam:WebCamComponent//will be populated by <ack-webcam [(ref)]="webcam">
  base64;
  flashLight: boolean = false;

  options = {
    width    : 580,
    height   : 400
  }
  constructor(
    public dialogRef: MatDialogRef<WebcamDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WebcamDialogData, public chatSvc: ChatService,) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  genBase64(){
      this.flashLight = true;
      this.webcam.getBase64()
      .then( base=>{
        this.base64=base;
        let chatMessage = {
          message_type: 3,
          message: null,
          message_date: new Date(),
          from: this.data.name,
          webcamUrl: this.base64,
        }
        this.chatSvc.sendMessage(chatMessage).subscribe((result)=>{
          console.log(result);
        });
      })
      .catch( e=>console.error(e) );
  } 
}