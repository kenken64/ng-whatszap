// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBhsJKujKhAkUPLoW5FeE2yMrstT8vTM30",
    authDomain: "chat-app-acea7.firebaseapp.com",
    databaseURL: "https://chat-app-acea7.firebaseio.com",
    projectId: "chat-app-acea7",
    storageBucket: "chat-app-acea7.appspot.com",
    messagingSenderId: "189475517778"
  },
  iceservers: 'http://localhost:3000/getICETokens',
  wsserver: 'http://localhost:3000',
  firebase_cms_url: `https://firebasestorage.googleapis.com/v0/b/chat-app-acea7.appspot.com/o/`,
  firebase_cms_url_postfix: '?alt=media&token=0bb313a8-2b7b-4b59-af44-5e1044376e0e',
  sentiment_api: 'http://localhost:3002'
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
