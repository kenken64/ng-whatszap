import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { environment } from '../environments/environment';
import { ChatModule } from './chat-component/chat-module';
import { FormsModule } from '@angular/forms';

import {
  MatInputModule,
  MatDialogModule
} from '@angular/material';
import { ChatappComponent } from './chat-component/chatapp/chatapp.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatappComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FlexLayoutModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    ChatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
