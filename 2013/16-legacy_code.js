#!/usr/bin/env node
// Challenge 16 - Legacy code
// by Pedro Ladaria <pedro.ladaria@gmail.com>

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

/*
var script = fs.readFileSync('turing.txt').toString('utf8').trim().split('\n')
var tapes = new Input()

var states = {
  'start':{},
  'end': {}
}
for (var i = 0; i < 33; i++) states['state'+i] = {}

script.forEach(function (v, i) {
  v = v.split(',')
  var c = v[1].split(':')
  var move = {'L': -1, 'R': 1, 'S': 0}
  states[v[0]][c[0]] = {
    'name': v[0],
    'char': c[1],
    'move': move[v[2]],
    'jump': v[3]
  }
})


while (input = tapes.read()) {
  console.log(input)
  input = input.trim().split('')
  var now = states.start['#']
  var header = 0
  var write = ''
  while (true) {
    input[header] = now.char
    header+= now.move
    if (header >= input.length) input.push('_')
    if (now.jump == 'end') break
    now = states[now.jump][input[header]]
  }

  console.log(input.join('').replace(/_/g, ''))
}
*/

var big = require('bigint')

var tapes = new Input()
while (input = tapes.read()) {
  input = input.trim().split('#')
  var res = big(0), mul, num, len
  var i = 0
  input.forEach(function (bin) {
    if (bin.length > 0) {
      if (i == 0) {
        mul = big(bin, 2)
        i++
      }
      else {
        num = big(bin, 2)
        num = num.mul(mul)
        res = res.add(num)
      }
      len = bin.length
    }
  })
  res = res.toString(2)
  while (res.length < len) res = '0'+res
  console.log('#'+res+'#')
}
