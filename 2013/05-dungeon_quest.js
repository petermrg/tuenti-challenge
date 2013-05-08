#!/usr/bin/env node
// Challenge 5 - Dungeon Quest
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

// Gets the sum of the values of the best reachable gems in that zone
var findGems = function(x, y, z, g) {
  var x1 = x-z,
      y1 = y-z,
      x2 = x+z,
      y2 = y+z

  if (x1 < 0) x1 = 0;
  if (y1 < 0) y1 = 0;
  if (x2 > M-1) x2 = M-1;
  if (y2 > N-1) y2 = N-1;
  var gems = []
  for (i = x1; i <= x2; i++) {
    for (j = y1; j<= y2; j++) {
      if ((g[i + j*M] > 0) && (Math.abs(i-x) + Math.abs(j-y) <= z)) {
        gems.push(g[i + j*M])
      }
    }
  }
  if (gems.length == 0) return 0
  gems.sort(function(a, b){ return b-a })
  value = 0
  var i = 0
  while (i < z && i < gems.length) {
    value+= gems[i]
    i++
  }
  return value
}

var max = 0
var explore = function(x, y, ox, oy, z, gc, gi, sum) {
  if (x < 0 || y < 0 || x >= M || y >= N || gc <= 0 || z < 0) return sum
  var g = gi.slice(0)
  var pos = x + y*M
  if (gi[pos] > 0) {
    sum+= g[pos]
    g[pos] = 0
    gc--
  }
  var gemsValue = 0
  if (z > 0) {
    var s = [sum]
    if (x >= ox && sum + findGems(x+1, y, z, g) >= max) s.push(explore(x+1, y, x, y, z-1, gc, g, sum))
    if (x <= ox && sum + findGems(x-1, y, z, g) >= max) s.push(explore(x-1, y, x, y, z-1, gc, g, sum))
    if (y >= oy && sum + findGems(x, y+1, z, g) >= max) s.push(explore(x, y+1, x, y, z-1, gc, g, sum))
    if (y <= oy && sum + findGems(x, y-1, z, g) >= max) s.push(explore(x, y-1, x, y, z-1, gc, g, sum))
    sum = Math.max.apply(Math, s)
    if (sum > max) max = sum
    return sum
  }
  return sum
}

var input = new Input()
var M, N, Z
var T = input.readInt()

for (var t = 0; t < T; t++) {
  var a, x, y, Z, g, gc, C
  max = 0
  a = []
  a = input.read().split(',')
  M = parseInt(a[0])
  N = parseInt(a[1])
  a = input.read().split(',')
  x = parseInt(a[0])
  y = parseInt(a[1])
  Z = input.readInt()
  gc = input.readInt()
  g = new Array(M * N)
  for (var i = 0; i < g.length; i++) g[i] = 0
  input.read().split('#').forEach(function(v) {
    a = v.split(',')
    gx = parseInt(a[0])
    gy = parseInt(a[1])
    gv = parseInt(a[2])
    g[gx + gy * M] = gv
  })
  var s = []
  s.push(explore(x+1, y, x, y, Z-1, gc, g, 0))
  s.push(explore(x-1, y, x, y, Z-1, gc, g, 0))
  s.push(explore(x, y+1, x, y, Z-1, gc, g, 0))
  s.push(explore(x, y-1, x, y, Z-1, gc, g, 0))
  console.log(Math.max.apply(Math, s))
}

