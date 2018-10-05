import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {NgModule} from '@angular/core';

import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ChatFooterComponent } from './chat-footer/chat-footer.component';
import { environment } from '../../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { HttpClientModule } from '@angular/common/http';
import { ChatService } from '../services/chat.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import  { DialogOverviewExampleDialog } from './chat-window/chat-window.component';
import  { WebcamDialog } from './chat-header/chat-header.component';

import { WebCamModule } from 'ack-angular-webcam';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface,
    PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
    };

import { ContentLoaderModule } from '@netbasal/content-loader';


import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';

import {PlatformModule} from '@angular/cdk/platform';
import {ObserversModule} from '@angular/cdk/observers';
import { VideocallComponent } from './videocall/videocall.component';
import { ChatappComponent } from './chatapp/chatapp.component';

const routes = [
  {
    path: 'Home',
    component: ChatappComponent,
  },
  {
    path: 'video-call',
    component: VideocallComponent,
  },
  {
    path: '', 
    redirectTo: '/Home', 
    pathMatch: 'full' 
},
{
    path: '**', 
    component: ChatappComponent,
}
]

/**
 * NgModule that includes all Material modules that are required to serve the demo-app.
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ObserversModule,
    PlatformModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireMessagingModule,
    PerfectScrollbarModule,
<<<<<<< HEAD
    WebCamModule,
    ContentLoaderModule
=======
    WebCamModule
>>>>>>> 257a9c87fab7a78af3656e5624b0dda3657aa628
  ],
  entryComponents: [DialogOverviewExampleDialog, WebcamDialog],
  declarations: [
    DialogOverviewExampleDialog,
    WebcamDialog,
    ChatWindowComponent,
    ChatFooterComponent,
    ChatHeaderComponent
  ],
  providers: [
    ChatService,
    AngularFirestore
  ],
  exports: [
    ChatWindowComponent,
    ChatFooterComponent,
    ChatHeaderComponent,
    RouterModule
  ]
})
export class ChatModule {}