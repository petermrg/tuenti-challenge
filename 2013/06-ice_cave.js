#!/usr/bin/env node
// Challenge 6 - Ice Cave
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

var UP = 1, DN = 2, LF = 4, RG = 8
var DDD = { '1': 'up', '2': 'down', '4': 'left', '8': 'right', }

var slide = function(x, y, dx, dy, w, h, s, t, map, buf, time, dir) {
  if ((buf[y][x] & dir) > 0) return Infinity
  buf[y][x]|= dir

  if (map[y+dy][x+dx] == '#') return Infinity

  // var tmp = map[y][x]
  // map[y][x] = 'X'
  // console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
  // console.log(map)
  // console.log(time+' '+DDD[dir]+' speed: '+s)
  // var wait = 799999999
  // while (wait--) {}
  // map[y][x] = tmp

  var steps = 0
  while (map[y+dy][x+dx] == '·') {
    x+= dx
    y+= dy
    steps++
  }
  time+= t + steps/s

  if (map[y+dy][x+dx] == 'O') {
    time+= (1/s)
    //console.log('END!!!! '+time)
    return time
  }

  var t2 = [Infinity]
  if (dir != LF && dir != RG) t2.push(slide(x, y, 1, 0, w, h, s, t, map, buf, time, RG))
  if (dir != LF && dir != RG) t2.push(slide(x, y,-1, 0, w, h, s, t, map, buf, time, LF))
  if (dir != DN && dir != UP) t2.push(slide(x, y, 0, 1, w, h, s, t, map, buf, time, DN))
  if (dir != DN && dir != UP) t2.push(slide(x, y, 0,-1, w, h, s, t, map, buf, time, UP))

  return Math.min.apply(Math, t2)
}

var cases = input.readInt()
while (cases--) {
  var W = input.readInt()
  var H = input.readInt()
  var S = input.readInt()
  var T = input.readInt()
  var x = 0
  var y = 0
  var ex = 0
  var ey = 0
  var map = []
  var buf = []
  var j
  for (var i = 0; i < H; i++) {
    buf.push(new Array(W))
    j = W
    while (j--) buf[i][j] = 0
    map.push(input.read().trim().split(''))
    if ((j = map[i].indexOf('X')) > 0) {
      x = j
      y = i
      map[y][x] = '·'
    }
  }

  var t = []
  t.push(slide(x, y, 1, 0, W, H, S, T, map, buf, 0, RG));
  t.push(slide(x, y,-1, 0, W, H, S, T, map, buf, 0, LF));
  t.push(slide(x, y, 0, 1, W, H, S, T, map, buf, 0, DN));
  t.push(slide(x, y, 0,-1, W, H, S, T, map, buf, 0, UP));

  console.log(Math.round(Math.min.apply(Math, t)));
}
