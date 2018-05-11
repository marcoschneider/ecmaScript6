'use strict';

let cookies;

const express = require('express');
const fileUpload = require('express-fileupload');
const dir = require('node-dir');
const cookieParser = require('cookie-parser');
const download = require('download-file');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');

app.use(fileUpload());
app.use('/purecss', express.static(__dirname + '/node_modules/purecss/build'));
app.use(cookieParser());
app.use('/js', express.static(__dirname + '/assets/js'));
app.use('/files', express.static(__dirname + '/assets/files/upload'));
app.use('/css', express.static(__dirname + '/assets/css'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));



app.get('/', function (req, res) {
  cookies = req.cookies;
  res.sendFile(`${__dirname}/markup/nickname.html`);
  console.log(cookies);
});




app.post('/', function (req, res) {

  let nickname = req.body.nickname;

  if(nickname !== ""){
    res.cookie('Nickname', nickname);
    res.redirect('/decision');
  } else {
    res.redirect('/');
  }

});



//Checks if cookie is already set and redirects to decision page
app.get('/decision', function (req, res) {

  cookies = req.cookies;

  if(typeof cookies.Nickname === "undefined"
      || cookies.Nickname === ''){
    res.redirect('/');
    return;
  }
  res.sendFile(`${__dirname}/markup/decision-frontpage.html`);
});



//
app.get('/upload', function (req, res) {
  res.sendFile(`${__dirname}/markup/upload.html`);
});




app.post('/upload', function(req, res) {

  res.redirect('/upload');


  // Uploaded files:
 /* if(req.files.sampleFile === undefined){
    return console.log('No files where uploaded');
  }

  let file = req.files.sampleFile;

  file.mv(`assets/files/upload/${file.name}`,(err) => {
    if (err) {
      res.send(err);
    }
    console.log("Uploaded File");
  });*/
});




app.get('/display', function (req, res) {
  res.sendFile(`${__dirname}/markup/download.html`);
  //res.send(dir.readFiles('/assets/files/upload'));
  dir.files('assets/files/upload/', function(err, files) {
    if (err){
      console.log(err);
    }
    console.log(files);
    //res.send(files);
  });
});




app.post('/display', function (req, res) {
  let filename = req.body.filename;
  let url = "/files/";

  url = `http://localhost:3000${url}${filename}`;

  console.log(url);

  download(url, function (err) {
    if (err){
      console.log(err);
    }
    res.redirect(url);
  });
  
});



//Runs server
http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});