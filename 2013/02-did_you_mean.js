#!/usr/bin/env node
// Challenge 2 - Did you mean...?
// by Pedro Ladaria <pedro.ladaria@gmail.com>

// Requires node.js v.0.10

var fs = require('fs');
var whitespace = [' ','\t','\n','\r']
var newline = ['\n','\r']
var Input = function() {
  this.data = fs.readFileSync('/dev/stdin').toString('ascii')
  this.pos = 0
}
Input.prototype.skipWhiteSpace = function() {
  while (whitespace.indexOf(this.data.charAt(this.pos)) >= 0) this.pos++
}
Input.prototype.skipComments = function() {
  this.skipWhiteSpace()
  while (this.data.charAt(this.pos) == '#') {
    this.readLine()
    this.skipWhiteSpace()
  }
}
Input.prototype.read = function() {
  var s = ''
  this.skipWhiteSpace()
  while (whitespace.indexOf(this.data.charAt(this.pos)) < 0) s += this.data.charAt(this.pos++)
  return s
}
Input.prototype.readInt = function() {
  return parseInt(this.read())
}
Input.prototype.readLine = function() {
  var s = ''
  this.skipWhiteSpace()
  while (newline.indexOf(this.data.charAt(this.pos)) < 0) s += this.data.charAt(this.pos++)
  return s
}

var sortWord = function(s) {
  return s.split('').sort().join('')
}

/*
  readDictionary() Crea una lista de arrays cuyos índices son la palabra
  con las letras ordenadas alfabéticamente

  por ejemplo, de las siguientes palabras:
    ['roma', 'hola', 'mora', 'amor']

  creará:
  {
    amor: ['amor', 'roma', 'mora'],
    hola: ['hola']
  }

  De este modo, para encontrar las equivalencias, sólo tengo que ordenar
  las letras de la palabra y buscarlo en la lista :)

  Crear la lista del diccionario grande le lleva 1 minuto (es javascript)
  pero luego encuentra las equivalencias en O(1)
*/
var readDictionary = function(file) {
  var buffer = fs.readFileSync(file).toString('ascii').split('\n')
  var w = {}
  var s = ''
  buffer.forEach(function(v) {
    v = v.trim()
    s = sortWord(v)
    if (!w[s]) w[s] = [v]
    else w[s].push(v)
  })
  return w
}

var arrayUniqueAndExclude = function(arr, exclude) {
  return arr.filter(function (e, i, arr) {
    if (e === exclude) return false;
    return arr.lastIndexOf(e) === i;
  });
}

var input = new Input()

input.skipComments()
var words = readDictionary(input.readLine())

input.skipComments()
var n = input.readInt()

input.skipComments()

while (n--) {
  var word = input.read()
  var sort = sortWord(word)
  if (!words[sort]) {
    console.log(word+' ->')
  }
  else {
    console.log(word+' -> '+arrayUniqueAndExclude(words[sort], word).sort().join(' '))
  }
}
