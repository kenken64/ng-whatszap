import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
declare var window :any;

@Component({
  selector: 'app-videocall',
  templateUrl: './videocall.component.html',
  styleUrls: ['./videocall.component.css']
})
export class VideocallComponent implements OnInit  {
  title = 'video-call';
  isChannelReady = false;
  isInitiator = false;
  isStarted = false;
  localStream;
  pc;
  remoteStream;
  turnReady;
  
  room = 'fsf2018';
  socket;
  constructor(private http: HttpClient, private route : Router) {
    this.socket = io.connect(environment.wsserver);
  }

  // viewchild doesnt work for video tag !!!
  // @ViewChild('localVideo') localVideo;
  // @ViewChild('remoteVideo') remoteVideo;
  localVideo;
  remoteVideo;
  tokens:any;

  ngOnInit () {
    
    let self = this;
    this.http.get(environment.iceservers).subscribe(x=>{
      self.tokens = x;
      self.setConnection();
    });
  }

  endCall(){
    this.localStream.getAudioTracks()[0].stop();
    this.localStream.getVideoTracks()[0].stop();
    this.remoteStream.getAudioTracks()[0].stop();
    this.remoteStream.getVideoTracks()[0].stop();
    this.route.navigate(['/Home']);
  }

  setConnection(){
    let self=this;
    self.localVideo = document.querySelector('#localVideo');
    self.remoteVideo = document.querySelector('#remoteVideo');
    
    window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
    .then(self.gotStream.bind(self))
    .catch(function (e) {
      console.log(e);
    });


    window.onbeforeunload = function () {
      self.sendMessage('bye');
    };

    if (self.room !== '') {
      self.socket.emit('create or join', self.room);
      console.log('Attempted to create or  join room', self.room);
    }
    self.socket.on('created', function (room) {
      console.log('Created room ' + room);
      self.isInitiator = true;
    });

    self.socket.on('full', function (room) {
      console.log('Room ' + room + ' is full');
    });

    self.socket.on('join', function (room) {
      console.log('Another peer made a request to join room ' + room);
      console.log('This peer is the initiator of room ' + room + '!');
      self.isChannelReady = true;
    });

    self.socket.on('joined', function (room) {
      console.log('joined: ' + room);
      self.isChannelReady = true;
    });

    self.socket.on('log', function (array) {
      console.log.apply(console, array);
    });
    // This client receives a message
    self.socket.on('message', function (message) {
      console.log('Client received message:', message);
      if (message === 'got user media') {
        self.maybeStart();
      } else if (message.type === 'offer') {
        if (!self.isInitiator && !self.isStarted) {
          self.maybeStart();
        }
        self.pc.setRemoteDescription(new RTCSessionDescription(message));
        self.doAnswer();
      } else if (message.type === 'answer' && self.isStarted) {
        self.pc.setRemoteDescription(new RTCSessionDescription(message));
      } else if (message.type === 'candidate' && self.isStarted) {
        var candidate = new RTCIceCandidate({
          sdpMLineIndex: message.label,
          candidate: message.candidate
        });
        self.pc.addIceCandidate(candidate);
      } else if (message === 'bye' && self.isStarted) {
        self.handleRemoteHangup();
      }
    });
  }

  sendMessage(message) {
    console.log('Client sending message: ', message);
    this.socket.emit('message', message);
  }

  gotStream(stream) {
    console.log('Adding local stream.');
    this.localVideo.src = window.URL.createObjectURL(stream);
    this.localStream = stream;
    this.sendMessage('got user media');
    if (this.isInitiator) {
      this.maybeStart();
    }
  }

  constraints = {
    video: true
  };

  maybeStart() {
    if (!this.isStarted && typeof this.localStream !== 'undefined' && this.isChannelReady) {
      console.log('>>>>>> creating peer connection');
      this.createPeerConnection();
      this.pc.addStream(this.localStream);
      this.isStarted = true;
      if (this.isInitiator) {
        this.doCall();
      }
    }
  }

  createPeerConnection() {
    try {
      var configuration = { iceServers: this.tokens };
      // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
      this.pc = new RTCPeerConnection(configuration);
      this.pc.onicecandidate = this.handleIceCandidate.bind(this);
      this.pc.onaddstream = this.handleRemoteStreamAdded.bind(this);
      this.pc.onremovestream = this.handleRemoteStreamRemoved.bind(this);
    } catch (e) {
      console.log('Failed to create PeerConnection, exception: ' + e.message);
      alert('Cannot create RTCPeerConnection object.');
      return;
    }
  }

  handleIceCandidate(event) {
    console.log('icecandidate event: ', event);
    if (event.candidate) {
      this.sendMessage({
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      });
    } else {
      console.log('End of candidates.');
    }
  }

  handleRemoteStreamAdded(event) {
    console.log('Remote stream added.');
    this.remoteVideo.src = window.URL.createObjectURL(event.stream);
    this.remoteStream = event.stream;
  }

  handleCreateOfferError(event) {
    console.log('createOffer() error: ', event);
  }

  doCall() {
    console.log('Sending offer to peer');
    this.pc.createOffer(this.setLocalAndSendMessage.bind(this), this.handleCreateOfferError.bind(this));
  }

  doAnswer() {
    console.log('Sending answer to peer.');
    this.pc.createAnswer().then(
      this.setLocalAndSendMessage.bind(this),
      this.onCreateSessionDescriptionError.bind(this)
    );
  }

  setLocalAndSendMessage(sessionDescription) {
    this.pc.setLocalDescription(sessionDescription);
    console.log('setLocalAndSendMessage sending message', sessionDescription);
    this.sendMessage(sessionDescription);
  }

  onCreateSessionDescriptionError(error) {
    console.error('Failed to create session description: ' + error.toString());
  }

  handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed. Event: ', event);
  }

  hangup() {
    console.log('Hanging up.');
    stop();
    this.sendMessage('bye');
  }

  handleRemoteHangup() {
    console.log('Session terminated.');
    this.stop();
    this.isInitiator = false;
  }

  stop() {
    this.isStarted = false;
    this.pc.close();
    this.pc = null;
  }
  
}
