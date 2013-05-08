#!/usr/bin/env node
// Challenge 10 - The Checking Machine
// by Pedro Ladaria <pedro.ladaria@gmail.com>

var whitespace = [' ','\n','\r','\t']

var _a = 'a'.charCodeAt(0),
    _z = 'z'.charCodeAt(0),
    _0 = '0'.charCodeAt(0),
    _9 = '9'.charCodeAt(0),
    BO = '['.charCodeAt(0),
    BC = ']'.charCodeAt(0)

var isAlpha = function(c) {
  if (c < _a || c > _z || !c) return false
  return true
}

var isNumber = function(c) {
  if (c < _0 || c > _9 || !c) return false
  return true
}

var Input = function() {
  this.data = require('fs').readFileSync('/dev/stdin').toString('utf8')
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

var input = new Input();
var str

var crypto = require('crypto')
var md5

var matchBracket = function(buf, i) {
  var c = 0
  while (i < buf.length) {
    if (buf[i] == BO) c++
    else {
      if (buf[i] == BC) {
        if (--c == 0) return i
      }
    }
    i++
  }
}

// v.2 Rewrote all to use Buffers instead of Arrays
var expand = function(buf) {
  var i = 0
  while (i < buf.length) {
    // get chars
    var s = ''
    var alphaStart = i
    var alphaEnd = i + 1
    if (isAlpha(buf[i])) {
      while (isAlpha(buf[++i])) alphaEnd++
      md5.update(buf.slice(alphaStart, alphaEnd))
    }
    // get number
    var n = 0
    if (isNumber(buf[i])) {
      n = buf[i] - _0
      while (isNumber(buf[++i])) n = (10 * n) + (buf[i] - _0)
      // get expansion
      if (buf[i] == BO) {
        var closing = matchBracket(buf, i)
        var inner = buf.slice(i + 1, closing)
        var k = 0
        while (k < inner.length) {
          if (!isAlpha(inner[k])) break;
          k++
        }
        if (k == inner.length) {
          while (n--) md5.update(inner)
        }
        else {
          var expStr = new Buffer(n * inner.length)
          while (n--) inner.copy(expStr, n * inner.length)
          expand(expStr)
        }
        i = closing + 1
      }
    }
  }
}

// v.3 precalculate highest levels
var precalc = function(buf) {
  var deep = 2
  var maxMem = 100*1024*1024 // max memory usage per item
  // search highest level brackets
  while (true) {
    var c = 0
    var i = 0
    var max = 0
    var open = 0
    while (i < buf.length) {
      if (buf[i] == BO) {
        c++
        if (c > max) {
          c = max
          open = i
        }
      }
      else if (buf[i] == BC) c--
      i++
    }
    if (open > 0) {
      var close = matchBracket(buf, open)
      var inner = buf.slice(open+1, close)
      // get number
      var j = open - 1
      var n = buf[j] - _0
      var nc = 1
      while (isNumber(buf[--j])) {
        n+= Math.pow(10, nc) * (buf[j] - _0)
        nc++
      }
      if (n * inner.length > maxMem) return buf
      var expStr = new Buffer(n * inner.length)
      while (n--) inner.copy(expStr, n * inner.length)
      var result = new Buffer((j + 1) + expStr.length + (buf.length - close - 1))
      buf.copy(result, 0, 0, j + 1)
      expStr.copy(result, j + 1, 0)
      buf.copy(result, j + 1 + expStr.length, close + 1)
      buf = result
    }
    else {
      return buf
    }
  }
  return result
}

while (str = input.read()) {
  md5 = crypto.createHash('md5')
  expand(precalc(new Buffer(str)))
  console.log(md5.digest('hex'))
}
