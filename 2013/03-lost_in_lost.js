#!/usr/bin/env node
// Challenge 3 - Lost in Lost
// by Pedro Ladaria <pedro.ladaria@gmail.com>

var whitespace = [' ','\n','\r','\t']
var newline = ['\n','\r']
var newscene = ['.','<','>']

var Input = function() {
  this.data = require('fs').readFileSync('/dev/stdin').toString('utf8').split(' .').join('\n.')+'\n'
  this.pos = 0
}
Input.prototype.skipWhiteSpace = function() { while (whitespace.indexOf(this.data.charAt(this.pos)) >= 0) this.pos++ }
Input.prototype.read = function() {
  var s = ''
  this.skipWhiteSpace();
  while (whitespace.indexOf(this.data.charAt(this.pos)) < 0) s += this.data.charAt(this.pos++)
  return s
}
Input.prototype.readInt = function() { return parseInt(this.read()) }
Input.prototype.readLine = function() {
  var s = ''
  this.skipWhiteSpace()
  if (this.pos >= this.data.length) return false;
  while (newline.indexOf(this.data.charAt(this.pos)) < 0) s += this.data.charAt(this.pos++)
  return s
}

var getScenes = function(scenes) {
  var r = []
  if (newscene.indexOf(scenes.charAt(0)) < 0) return false
  var i = 0
  while (i < scenes.length) {
    var pre = scenes.charAt(i++)
    var txt = ''
    while (newscene.indexOf(scenes.charAt(i)) < 0 && i < scenes.length) txt+= scenes.charAt(i++)
    r.push({'pre': pre, 'txt': txt})
  }
  return r
}

var insertScene = function(index, item) {
  var stored = order[item.txt]
  if (!stored) {
    order[item.txt] = { 'pre': item.pre, 'pos': index }
    return true;
  }
  else {
    switch (item.pre) {

      case '.':
        switch (stored.pre) {
          case '.': return false
          case '<': return false
          case '>':
            order[item.txt] = { 'pre': item.pre, 'pos': index }
            lastScene = index
            return true
        }

      case '>':
        switch (stored.pre) {
          case '.': return false
          case '>':
            order[item.txt] = { 'pre': item.pre, 'pos': index }
            return true
          case '<': return false
        }

      case '<':
        switch (stored.pre) {
          case '.': return true
          case '<': return true
          case '>':
            //console.log('< > '+stored.pos+' - '+index)
            if (stored.pos == index - 2) {
              order[item.txt] = { 'pre': '.', 'pos': index }
              lastScene = index + 3
            }
            else {
              order[item.txt] = { 'pre': item.pre, 'pos': index }
            }
            return true
        }
    }
    return false

  }
};

var input = new Input()
var n = input.readInt()

var order = {} // reverse search object
var scenes = []
var ordered = []
var lastScene = 0

while (n--) {
  order = {}

  scenes = input.readLine()
  if (scenes != false) {
    // console.log(scenes.substr(0,40))
    scenes = getScenes(scenes)
  }



  ordered = []
  var invalid = false

  if (scenes === false) {
    invalid = true;
  }
  else {
    lastScene = -1
    order = {}

    for (var i = 0; i < scenes.length; i++) {
      // console.log(i)

      if (i == 0 && scenes[i].pre != '.') {
        invalid = true
      }

      else if (scenes[i].pre == '.') {
        lastScene = i * 2
        if (!insertScene(lastScene, scenes[i])) {
          invalid = true;
          break;
        }
      }

      else if (scenes[i].pre == '<') {
        if (!insertScene(lastScene - 1, scenes[i])) {
          invalid = true
          break
        }
      }

      else if (scenes[i].pre == '>') {
        if (!insertScene(lastScene + 1, scenes[i])) {
          invalid = true
          break
        }
      }

    }

  }

  if (invalid == true) {
    console.log('invalid')
    continue
  }

  var orderArr = []
  Object.keys(order).forEach(function(k) { // object to array conversion
    orderArr.push({
      'pos': order[k].pos,
      'pre': order[k].pre,
      'txt': k
    })
  })

  orderArr.sort(function(a, b) { return a.pos - b.pos; }) // order by pos

  // console.log(orderArr);

  var many = false
  var result = []
  var dots = 0;
  for (var i = 0; i < orderArr.length; i++) {
    if (orderArr[i].pre == '.') dots++
    if ((i > 0) && (i < orderArr.length-1) && (orderArr[i].pre != '.')) {
      many = true
      break
    }
    result.push(orderArr[i].txt)
  }

  if (dots == 0) {
    console.log('invalid')
    continue
  }
  else if (many == true) {
    console.log('valid')
    continue
  }

  console.log(result.join(','))

}
