#!/usr/bin/env node
// Challenge 1 - Bitcoin to the future
// by Pedro Ladaria <pedro.ladaria@gmail.com>

var whitespace = [' ','\n','\r','\t']
var newline = ['\n','\r']
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
Input.prototype.readIntList = function() {
  var r = []
  while (whitespace.indexOf(this.data.charAt(this.pos)) >= 0) this.pos++
  while (newline.indexOf(this.data.charAt(this.pos)) < 0) r.push(this.readInt())
  return r
}

var input = new Input()
var T = input.readInt()

for (var t = 0; t < T; t++) {
  var euros = input.readInt()
  var coins = 0
  var list = input.readIntList()
  var i = 0;
  while (i < list.length-1) {
    // compra todo
    if (list[i] <= list[i+1]) {
      coins+= Math.floor(euros / list[i])
      euros = euros % list[i]
    }
    // vende todo
    else {
      euros+= coins * list[i]
      coins = 0;
    }
    i++
  }
  // cuenta beneficios
  euros+= coins * list[i]

  console.log(euros)
}
