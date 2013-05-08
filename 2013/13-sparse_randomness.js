#!/usr/bin/env node
// Challenge 13 - Sparse randomness
// by Pedro Ladaria <pedro.ladaria@gmail.com>

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

var T = input.readInt()

for (var t = 0; t < T; t++) {
  console.log('Test case #'+(t+1))
  var N = input.readInt()
  var M = input.readInt()
  var nums = new Int32Array(N)
  for (var n = 0; n < N; n++) nums[n] = input.readInt()
  for (var m = 0; m < M; m++) {
    var s = input.readInt()-1
    var e = input.readInt()-1
    var exists = {}
    var max = 1
    for (var i = s; i <= e; i++) {
      if (!exists[nums[i]]) exists[nums[i]] = 1
      else if (++exists[nums[i]] > max) max = exists[nums[i]]
    }
    console.log(max)
  }
}
