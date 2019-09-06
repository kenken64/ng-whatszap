import { Component, Inject, Output, EventEmitter, OnInit, HostListener, ViewChild, ChangeDetectionStrategy,
  ChangeDetectorRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../model/chat-message';
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { finalize, map, catchError } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWindowComponent implements OnInit{
  name: string;
  topHeight : string = '85px';
  maxHeight: string = "600px";
  chats: ChatMessage[] = [];
  isContentLoader: boolean = true;
  public disabled: boolean = false;
  public type: string = 'component';
  public config: PerfectScrollbarConfigInterface = {suppressScrollY: false, suppressScrollX: true, 
    wheelPropagation: false};

  @ViewChild(PerfectScrollbarComponent, { static: true }) componentRef?: PerfectScrollbarComponent;
  @ViewChild('chatPS', { static: false }) chatPS?: PerfectScrollbarComponent;
  @Output() nameEvent = new EventEmitter<string>();
  
  deviceInfo = null;

  constructor(public dialog: MatDialog, 
    private chatSvc: ChatService,
    private cd: ChangeDetectorRef,
    private detectorSvc: DeviceDetectorService) { }

  ngOnInit(){
    this.chatSvc.getAllChatMessages()
    .pipe(
      map(value=>value),
      catchError(error => {
        console.log('error occured:', error);
        throw error;
      }),
      finalize(() => console.log("finally??"))
    ) 
    .subscribe(results=>{
      console.log(results);
      this.chats = results;
      this.cd.detectChanges();
      this.chatPS.directiveRef.scrollToBottom();
    });
    this.deviceInfo = this.detectorSvc.getDeviceInfo();
    console.log(this.deviceInfo.userAgent);

    let ipphone5se = /iPhone OS 10_3_1/gi;
    let galaxys5 = /SM-G900P/gi; 
    let samsung = /SAMSUNG/gi;
    let googlePixel2xl = /Pixel 2 XL/gi;
    let googlePixel2 = /Pixel 2 Build/gi;
    let iphone678 = /iPhone OS 11_0/gi;
    let ipad = /iPad/gi;
    let innerWidth = window.innerWidth;
    let innerHeight = window.innerHeight;
    console.log(innerWidth);
    console.log(innerHeight);
    
    if (this.deviceInfo.userAgent.search(ipphone5se) != -1 ) { 
      console.log("iphone 5 SE" ); 
      if(innerWidth == 646 && innerHeight == 364){
        this.maxHeight = "210px";
      }else{
        this.maxHeight = "458px";
      } 
    } 
    if (this.deviceInfo.userAgent.search(galaxys5) != -1 ) { 
      console.log("Samsung" );
      if(innerWidth == 718 && innerHeight == 404){
        this.maxHeight = "240px";
      } else {
        this.maxHeight = "530px";
      } 
    }

    if(this.deviceInfo.userAgent.search(samsung) != -1){
      
    }

    if (this.deviceInfo.userAgent.search(googlePixel2xl) != -1 ) { 
      console.log("Pixel 2 XL " ); 
      if(innerWidth == 901 && innerHeight == 450){
        console.log(".>>>")
        this.maxHeight = "290px";
      } else {
        console.log(".>>")
        this.maxHeight = "710px";
      }  
    }

    if(this.deviceInfo.userAgent.search(googlePixel2) != -1){
      console.log("Pixel 2" ); 
      if(innerWidth == 809 && innerHeight == 455){
        this.maxHeight = "288px";
      }else{
        console.log(".>>");
        this.maxHeight = "625px";
      }
    }
    
    if (this.deviceInfo.userAgent.search(iphone678) != -1 ) { 
      console.log("iphone 6 7 8" ); 
      if(innerWidth == 453 && innerHeight == 806){
        this.maxHeight = "560px";
      }

      if(innerWidth == 493 && innerHeight == 875){
        this.maxHeight = "627px";
      }

      if(innerWidth == 453 && innerHeight == 981){
        this.maxHeight = "700px";
      }

      if(innerWidth == 745 && innerHeight == 419){
        this.maxHeight = "253px";
      }

      if(innerWidth == 814 && innerHeight == 458){
        console.log("landscape mode ..");
        this.maxHeight = "295px";
      }

      if(innerWidth == 890 && innerHeight == 412){
        console.log("landscape mode ..");
        this.maxHeight = "255px";
      }
    }

    if (this.deviceInfo.userAgent.search(ipad) != -1 ) {
      console.log("ipad !" ); 
      if(innerWidth == 846 && innerHeight == 1128){
        this.maxHeight = "880px";
      }

      if(innerWidth == 1102 && innerHeight == 1471){
        this.maxHeight = "1220px";
      }

      if(innerWidth == 1102 && innerHeight == 827){
        this.maxHeight = "647px";
      }

      if(innerWidth == 1444 && innerHeight == 1083){
        this.maxHeight = "900px";
      }
    }
  }

  scrollBottom(){
    this.chatPS.directiveRef.scrollToBottom();
  }

  zoomImage(image){
    console.log("image " + image);
  }

  ngAfterViewInit() {
    
    this.chatSvc.getUserName().subscribe((result)=>{
      console.log("ngAfterViewInit" + JSON.stringify(result));
      let jsonName = JSON.stringify(result)
      if((typeof(result) === 'undefined') || (jsonName == '{}')){
        console.log("NAME > " + JSON.stringify(result));
        setTimeout(() => {
          const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '512px',
            data: {name: this.name}
          });
          dialogRef.updatePosition({ top: '50px', left: '20px' });
    
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.name = result;
            this.nameEvent.emit(this.name);
            this.isContentLoader = false;
            console.log('The dialog was closed ' + this.name);
          });
        });
      }
    });

    
  }

  onScrollEvent(event){}
}


@Component({
  selector: 'user-dialog',
  templateUrl: 'dialog-name.html',
  styleUrls: ['./chat-window.component.css']
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
