#!/usr/bin/env node
// Challenge 16 - Legacy code
// by Pedro Ladaria <pedro.ladaria@gmail.com>
/*
================================================================================
STEP1
================================================================================
*/
// Firstly, I have extracted all video frames:
//
// $ ffmpeg -i video.avi /media/sf_descargas/frames/$f%010d.jpg
//
// all frames had one of these filesizes:
// [ 16483, 22079, 22096, 15453, 14110, 13066, 12590, 12280, 12099, 11962, 11853, 11837 ]
// looking the led state that corresponds to each filesize I can know the states
// for all the files with the same size :)

/*
var fs = require('fs')

var files = fs.readdirSync('/media/sf_descargas/frames').sort()

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

var ledStates = {
  '16483': 0, '22079': 1, '22096': 0,
  '15453': 1, '14110': 1, '13066': 1,
  '12590': 0, '12280': 1, '12099': 0,
  '11962': 0, '11853': 0, '11837': 1,
}

var bits = []
var sizes = []
files.forEach(function (filename) {
  var size = fs.statSync('/media/sf_descargas/frames/'+filename).size
  bits.push(ledStates[size])
})
var str = ''
while (bits.length >= 8) {
  str+= String.fromCharCode(parseInt(bits.slice(0, 8).join(''),2));
  bits = bits.slice(8)
}
console.log(str);
*/

/*
================================================================================
STEP2
================================================================================
The above prints this HTTP header
*/
// GET / HTTP/1.1
// Host: silence.contest.tuenti.net
// Connection: keep-alive
// Cache-Control: max-age=0
// Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/* ;q=0.8
// User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31
// Accept-Encoding: gzip,deflate,sdch
// Accept-Language: en-US,en;q=0.8
// Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3
// Cookie: adminsession=true
// peter@Virtual:~/code/tuenti$ node 17-silence-on-the-wire.js
// GET / HTTP/1.1
// Host: silence.contest.tuenti.net
// Connection: keep-alive
// Cache-Control: max-age=0
// Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
// User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31
// Accept-Encoding: gzip,deflate,sdch
// Accept-Language: en-US,en;q=0.8
// Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3
// Cookie: adminsession=true
/*
var http = require('http');
var data = JSON.stringify({ 'important': 'data' });
var cookie = 'adminsession=true'
var client = http.createClient(80, 'silence.contest.tuenti.net');
var headers = {
    'Host': 'silence.contest.tuenti.net',
    'Cookie': cookie,
};

var request = client.request('GET', '/', headers);
request.on('response', function(response) {
  response.on('data', function(chunk) {
    console.log(chunk.toString('utf8'))
  });
  response.on('end', function() {
  });
});
request.write(data);
request.end();
*/

/*
================================================================================
STEP2
================================================================================
Finally... the real problem:

<html>
  <head>
    <title>Problem draft</title>
  </head>
  <body>
    <pre>For each input N return the sum of digits of N!</pre>
  </body>
</html>
*/

var whitespace = [' ','\n','\r','\t']
var fs = require('fs')

var Input = function() {
  this.data = fs.readFileSync('/dev/stdin').toString('utf8')
  this.pos = 0
}

Input.prototype.read = function() {
  var s = ''
  if (this.pos >= this.data.length) return false
  while (whitespace.indexOf(this.data.charAt(this.pos)) >= 0) this.pos++
  while (this.pos < this.data.length && whitespace.indexOf(this.data.charAt(this.pos)) < 0) {
    s += this.data.charAt(this.pos++)
  }
  return s
}

var big = require('bigint')
function factorial(n) {
  var m = big(1)
  for (var i = 1; i <= n; i++) {
    m = m.mul(i)
  }
  return m
}

function sumdigits(str) {
  var n = 0;
  for (var i = 0; i < str.length; i++) {
    n+= parseInt(str[i])
  }
  return n
}

var input = new Input()
var n
while (n = input.read()) {
  n = big(parseInt(n))
  console.log(sumdigits(factorial(n).toString()))
}
