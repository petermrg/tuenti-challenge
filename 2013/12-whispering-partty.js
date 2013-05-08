#!/usr/bin/env node
// Challenge 12 - Whispering paRTTY
// by Pedro Ladaria <pedro.ladaria@gmail.com>

/*
  Requeriments:

  $ sudo apt-get install sox
  $ sudo apt-get install libsox-fmt-mp3
  $ sudo apt-get install minimodem
*/

var fs = require('fs')
var exec = require('child_process').exec;

// read data
var data = fs.readFileSync('/dev/stdin', 'base64')
data = new Buffer(data.toString('binary'), 'base64')
data = new Buffer(data.toString('binary'), 'base64')

// write as mp3 file
fs.writeFileSync('temp.mp3', data, 'binary')

// convert mp3 to wav
exec('sox -v 0.9 temp.mp3 temp.wav', function (err, stdout, stderr) {

  // decode RTTY audio
  exec('minimodem -f temp.wav 45.45 -5', function (err, stdout, stderr) {
    console.log(stdout.trim())
  });
});
