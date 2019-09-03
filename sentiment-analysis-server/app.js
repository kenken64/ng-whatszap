'use strict';
require('dotenv').config()

const express = require("express");
const admin = require("firebase-admin");
const cors = require('cors');
const uuidv5 = require('uuid/v5');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

var serviceAccount = require('./credentials.json');
const NODE_PORT = process.env.PORT;

//"https://chat-app-6e112.firebaseio.com"
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

const db = admin.firestore();
const settings = { timestampsInSnapshots: true};
db.settings(settings);
const app = express();
app.use(cors());
const chats = db.collection('chat-sentiment-analysis');

var observer = chats.onSnapshot( querySnapshot => {
    console.log(`Received query snapshot of size ${querySnapshot.size}`);
    querySnapshot.docChanges().forEach(async change => {
      if (change.doc.data().label) return;
      if (change.type === 'added') {
        console.log('New : ', change.doc.data());
        console.log(__dirname);
        var result = sentiment.analyze(change.doc.data().text);
        console.dir(result);
        let newlabel = "positive";
        if(result.score <= 0){
            newlabel = "negative";
        }
        var updateData = {
            id: change.doc.data().id,
            text: change.doc.data().text,
            from: change.doc.data().from,
            label: newlabel
        };
        await chats.doc(change.doc.id).set(updateData).catch((err)=>console.log(err))
      }
    });
// ...
}, err => {
    console.log(`Encountered error: ${err}`);
});


app.get('/add', (req, res)=>{
    let textVal = req.query.text;
    let fromWho = req.query.fromWho;
    
    let value = {
        id: uuidv5('kennethphang.asia', uuidv5.DNS),
        text: textVal,
        from: fromWho,
    }
    chats.add(value).then((result)=>{
        console.log("created!" + result);
        res.status(200).json(result._referencePath.segments[1]);
    }).catch((error)=>console.log(error));
});

app.get('/getAllSentiment', (req, res)=>{
    let aiChats = [];
    chats.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        aiChats.push(doc.data())
      });
      res.status(200).json(aiChats);
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
});

app.listen(NODE_PORT, ()=>{
    console.log(`Listening ...${NODE_PORT}`);
})