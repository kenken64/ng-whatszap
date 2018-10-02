import { Component, OnInit } from '@angular/core';

import { ChatService } from './services/chat.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ng-chatapp';
  name:string;
  constructor(private chatSvc: ChatService){}
  
  ngOnInit(){
  }

  receiveName($event) {
    console.log($event);
    console.log("AppComponent >>>" + $event);
    this.name = $event
    console.log("sss" + this.name);
    this.chatSvc.setName(this.name)
  }
}
