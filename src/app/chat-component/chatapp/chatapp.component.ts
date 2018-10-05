import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chatapp',
  templateUrl: './chatapp.component.html',
  styleUrls: ['./chatapp.component.css']
})
export class ChatappComponent implements OnInit {
  name:string;
  constructor(private chatSvc: ChatService) { }

  ngOnInit() {
  }

  receiveName($event) {
    console.log($event);
    console.log("AppComponent >>>" + $event);
    this.name = $event
    console.log("sss" + this.name);
    this.chatSvc.setName(this.name)
  }

}
