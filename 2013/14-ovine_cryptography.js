#!/usr/bin/env node
// Challenge 14 - Ovine Cryptography
// by Pedro Ladaria <pedro.ladaria@gmail.com>

// ------------------------------------------------------------------------
// The key is retrieved using XOR frequency analisis
// ------------------------------------------------------------------------
/*
var freqTable = {
  ' ': 12702, 'a': 8167, 'b': 1492, 'c': 2782, 'd': 4253, 'e': 12702,
  'f': 2228, 'g': 2015, 'h': 6094, 'i': 6966, 'j': 153, 'k': 772, 'l': 4025,
  'm': 2406, 'n': 6749, 'o': 7507, 'p': 1929, 'q': 0095, 'r': 5987, 's': 6327,
  't': 9056, 'u': 2758, 'v': 978, 'w': 2360, 'x': 150, 'y': 1974, 'z': 74,
}

var input = require('fs').readFileSync('crypted.txt').toString('binary').trim().split('\n')
input.forEach(function (v, i, a) { a[i] = new Buffer(a[i], 'hex') })
var key = []
for (var c = 0; c < 512; c++) {
  var freqMax = 0
  var xor = 0
  for (var x = 0; x < 256; x++) {
    var freq = 0
    for (var i = 0; i < input.length; i++) {
      var xr = input[i][c] ^ x
      var ch = String.fromCharCode(xr)
      if (!!freqTable[ch]) freq+= freqTable[ch] * 10
      var ch = ch.toLowerCase()
      if (!!freqTable[ch]) freq+= freqTable[ch]
    }
    if (freq > freqMax) {
      freqMax = freq
      xor = x
    }
  }
  //console.log('c:'+c+' xor:'+xor+' freq:'+freqMax)
  key.push(xor)
}
console.log(key.join(','))
process.exit()
*/

// ------------------------------------------------------------------------
// The key has been manually corrected to get good results
// ------------------------------------------------------------------------

var key = [
 21,148, 77,100,100,183,109, 96,219, 50,252,114, 63,115,123,153,113,249,141, 12,
240, 97,229,252,232,122,114, 63,137,173,120,199,201,248,100,189,186,237,116,119,
200, 33,177,  3, 23, 46,174,217, 52,237, 26,195,146,120,  7,110,193,209,113,160,
122,239,172,241,100,138, 37,126,153, 80,219,227,199,106,  7,103, 35,229, 72, 58,
207, 67,161,183,101, 90,131,192,181,253,156, 74, 28,239,190,210, 57, 52,237,179,
133, 37,132,162,215,221, 86, 85,126,118,236,208,187, 82,212,103, 77, 81,116,236,
 14,227,  0,103,173,143,199,108,172, 13, 83,129,110, 78,154, 39, 75, 14,232, 66,
210,130,186, 65,143, 99,133,130,  0, 53,245, 28,116,170,224,190, 51,233,204,127,
 73, 60, 51,158, 11,197,235,218,112, 19,113,104, 32, 86,155,182, 32,101,101, 32,
101, 32,32,101,32,101,32,32,101,101, 32, 32,101, 32, 32, 32, 32, 32, 32, 32,101];

// console.log('--------------------------------------');
// var input = require('fs').readFileSync('crypted.txt').toString('binary').trim().split('\n')
// input.forEach(function (v, i, a) {
//   v = new Buffer(v, 'hex')
//   var output = []
//   for (var i = 0; i < v.length; i++) {
//     output.push(v[i] ^ key[i])
//   }
//   output = new Buffer(output)
//   console.log(output.toString('binary').trim())
// })
// process.exit()

// ------------------------------------------------------------------------
// Solution
// ------------------------------------------------------------------------

var input = require('fs').readFileSync('/dev/stdin').toString('binary').trim()

input = new Buffer(input, 'hex')
output = []

for (var i = 0; i < input.length; i++) {
  output.push(input[i] ^ key[i])
}

output = new Buffer(output)

console.log(output.toString('binary').trim())

