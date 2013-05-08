#!/usr/bin/env node
// Challenge 4 - Missing numbers
// by Pedro Ladaria <pedro.ladaria@gmail.com>

/*
fs = require('fs')
var file = fs.openSync('/media/sf_descargas/integers', 'r')
var bufSize = 1024*1024
var buff = new Buffer(bufSize)
var bits = new Buffer(2147483548/8)
var pos = 0
var n = 0;
bits.fill(0)
var missing = []
while ((bytes = fs.readSync(file, buff, 0, bufSize, pos)) > 0) {
  for (var i = 0; i < bytes>>2; i++) {
    n = buff.readUInt32LE(i*4)
    bits[n>>2]|= 1 << (n%8)
  }
  pos+= bufSize
  console.log('readed: '+(pos/bufSize)+'MB')
}
for (var i = 0; i < bits.length; i++) {
  if (bits[i] != 0xff) {
    for (var j = 0; j < 8; j++) {
      if (((bits[i] >> j) & 1) == 0) {
        missing.push(i*8+j)
      }
    }
  }
}
console.log(missing)
*/


// This list has been generated with the previous code
var missing =
[ 7303,
  8243,
  9854,
  12009,
  12793,
  14346,
  14680,
  15093,
  17857,
  19375,
  20084,
  22525,
  23054,
  23250,
  30197,
  36318,
  39334,
  40018,
  48871,
  50654,
  50721,
  54592,
  59393,
  61063,
  63138,
  63241,
  64549,
  66259,
  69103,
  76165,
  76685,
  81278,
  82333,
  83089,
  84011,
  85250,
  88429,
  90254,
  90271,
  90981,
  91165,
  93661,
  94654,
  99088,
  99146,
  99612,
  2147386534,
  2147387515,
  2147390868,
  2147393636,
  2147394767,
  2147394776,
  2147399790,
  2147404278,
  2147410474,
  2147411181,
  2147411772,
  2147414329,
  2147414440,
  2147415261,
  2147415351,
  2147416362,
  2147416780,
  2147416956,
  2147418296,
  2147419403,
  2147419606,
  2147421475,
  2147421911,
  2147424275,
  2147424781,
  2147425007,
  2147425958,
  2147427008,
  2147429783,
  2147430753,
  2147434866,
  2147436265,
  2147439441,
  2147442423,
  2147443250,
  2147454548,
  2147455603,
  2147457507,
  2147463138,
  2147465967,
  2147466563,
  2147466673,
  2147468436,
  2147470025,
  2147470723,
  2147470869,
  2147471405,
  2147474036,
  2147474185,
  2147476664,
  2147478255,
  2147478824,
  2147480866,
  2147480904 ]

var whitespace = [' ','\n','\r','\t']
var Input = function() {
  this.data = require('fs').readFileSync('/dev/stdin').toString('utf8')
  this.pos = 0
}
Input.prototype.read = function() {
  var s = ''
  while (whitespace.indexOf(this.data.charAt(this.pos)) >= 0) this.pos++
  while (whitespace.indexOf(this.data.charAt(this.pos)) < 0) s += this.data.charAt(this.pos++)
  return s
}
Input.prototype.readInt = function() { return parseInt(this.read()) }

var input = new Input()

var t = input.readInt()
while (t--) console.log(missing[input.readInt()-1])
