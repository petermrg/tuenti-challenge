#!/usr/bin/env node
// Challenge 7 - Boozzle
// by Pedro Ladaria <pedro.ladaria@gmail.com>

var whitespace = [' ','\n','\r','\t']
var fs = require('fs');

var Input = function() {
  this.data = fs.readFileSync('/dev/stdin').toString('utf8')
  this.pos = 0
}

Input.prototype.read = function() {
  var s = ''
  while (whitespace.indexOf(this.data.charAt(this.pos)) >= 0) this.pos++
  while (whitespace.indexOf(this.data.charAt(this.pos)) < 0) s += this.data.charAt(this.pos++)
  return s
}
Input.prototype.readUntil = function(char) {
  var s = ''
  while (whitespace.indexOf(this.data.charAt(this.pos)) >= 0) this.pos++
  while (this.data.charAt(this.pos) != char) s += this.data.charAt(this.pos++)
  s+= this.data.charAt(this.pos++)
  return s
}
Input.prototype.readInt = function() { return parseInt(this.read()) }

var allDirections = [
  { 'x':-1, 'y':-1 }, // top-left
  { 'x': 0, 'y':-1 }, // top
  { 'x': 1, 'y':-1 }, // top-right
  { 'x': 1, 'y': 0 }, // right
  { 'x': 1, 'y': 1 }, // bottom-right
  { 'x': 0, 'y': 1 }, // bottom
  { 'x':-1, 'y': 1 }, // bottom-left
  { 'x':-1, 'y': 0 }, // left
]
var EOW = '.' // end of word mark

// Recursive function - Gets all possible words
var getWords = function(x, y, width, height, board, node, used) {
  var offs = x+y*width
  if (x < 0 || y < 0 || x >= width || y >= height || used[offs] > 0) return []
  var u = used.slice(0)
  var words = []
  var cell = board[y][x]
  if (!node[cell.c]) return []
  u[offs] = 1
  if (!!node[cell.c][EOW]) words.push([cell])
  allDirections.forEach(function(d) {
    getWords(x+d.x, y+d.y, width, height, board, node[cell.c], u).forEach(function(w) {
      words.push([cell].concat(w))
    })
  })
  return words
}

// The dictionary file is converted into a graph/tree
var DICT = {}
fs.readFileSync('boozzle-dict.txt', 'utf8').trim().split('\n').forEach(function(w) {
  var node = DICT
  var word = (w.trim()+EOW).split('')
  for (var i = 0; i < word.length; i++) {
    if (!node[word[i]]) node[word[i]] = {}
    node = node[word[i]]
  }
})

// Processes the word list to get scores, remove duplicates and sort
var processWords = function(words, scores) {
  var r = {}
  words.forEach(function(w) {
    var score = 0
    var word = ''
    var wm = 1
    w.forEach(function(cell) {
      word+= cell.c
      if (cell.t == 1) { // char mult
        score+= scores[cell.c] * cell.v
      }
      else { // word mult (cell.t == 2)
        score+= scores[cell.c]
        wm = (cell.v > wm) ? cell.v : wm
      }
    })
    score = (score * wm) + word.length
    time = word.length+1
    if (!r[word] || r[word].score < score) r[word] = {
      'chars': word,
      'score': score,
      'time': time,
      'perf': score/time,
      'wm': wm
    }
  })
  var ra = []
  Object.keys(r).forEach(function(v) { ra.push(r[v]) }) // array conversion
  ra.sort(function(a, b) { // order by performance then by score
    if (b.perf == a.perf) {
      return b.score - a.score
    }
    return b.perf - a.perf
  })
  return ra
}

// Given a word info list and a time returns the best possible score
var getBestScore = function(words, time) {
  var score = 0
  while (time > 0 && words.length > 0) {
    if (words[0].time <= time) {
      score+= words[0].score
      // console.log('+ '+time+' '+JSON.stringify(words[0]))
      time-= words[0].time
      words.shift()
    }
    else {
      // console.log('- '+time+' '+JSON.stringify(words[0]))
      words.shift()
    }

  }
  return score
}

// test cases
var input = new Input()
var K = input.readInt()
while (K--) {

  // read scores
  var scores = {}
  input.readUntil('}').replace(/[{}'\s]/g, '').split(',').forEach(function(v) {
    v = v.split(':')
    scores[v[0]] = parseInt(v[1])
  })

  var T = input.readInt() // time
  var N = input.readInt() // rows
  var M = input.readInt() // cols

  // get board
  var board = [], used = []
  for (var j = 0; j < N; j++) {
    board[j] = []
    for (var i = 0; i < M; i++) {
      var cell = input.read().split('')
      board[j][i] = {
        'c': cell[0],
        't': parseInt(cell[1]),
        'v': parseInt(cell[2])
      }
      used[j*M+i] = 0
    }
  }

  var words = []
  for (var j = 0; j < N; j++) {
    for (var i = 0; i < M; i++) {
      words = words.concat(getWords(i, j, M, N, board, DICT, used))
    }
  }

  var unique = processWords(words, scores)

  // console.log(unique)
  // console.log('time: '+T)
  // console.log(JSON.stringify(scores))

  console.log(getBestScore(unique, T))
}
