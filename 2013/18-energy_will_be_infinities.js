#!/usr/bin/env node
// Challenge 18 - Energy will be infinities
// by Pedro Ladaria <pedro.ladaria@gmail.com>

var whitespace = [' ','\n','\r','\t']

var Input = function() {
  this.data = require('fs').readFileSync('/dev/stdin').toString('utf8')
  //require('fs').writeFileSync('test.txt', this.data)
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

var Node = function(dest, cost) {
  this.dest = [{ 'node': dest, 'cost': cost }]
}
var stack = []
var travel = function(origin, dest, nodes, visited, energy) {
  //console.log('travel: '+origin+'->'+dest+' energy: '+energy+' SL:'+stack.length)
  if (!visited[origin]) {
    visited[origin] = true
    //console.log('ORIGIN'+origin)
    if (!nodes[origin] || nodes[origin].dest.length == 0) return -Infinity
    nodes[origin].dest.forEach(function (d) {
      //console.log('push: ',d)
      stack.push([d.node, dest, nodes, visited, energy + (energy * d.cost)])
    })
    return -Infinity
  }
  else {
    if (origin == dest) return energy
    return -Infinity
  }
}

var startEnergy = 100

var isBuggy = function(nodes) {
  var keys = Object.keys(nodes)
  for (var i = 0; i < keys.length; i++) {
    var n = keys[i]
    //console.log('START TRAVEL: '+n)
    stack = []
    stack.push([n, n, nodes, [], startEnergy])
    var oe = 0, ne = 0
    while (stack.length > 0) {
      var p = stack.pop()
      ne = travel(p[0], p[1], p[2], p[3], p[4])
      if (ne > oe) oe = ne
    }
    //console.log(stack.length)
    //console.log('final: '+oe+'/'+startEnergy+'\n')
    if (oe > startEnergy) return true
  }
  return false
}

var N = input.readInt()

for (var n = 0; n < N; n++) {
  var stack = []
  var V = input.readInt()
  var E = input.readInt()
  //console.log('CASE: '+(n+1)+'/'+N)
  //console.log('Nodes: '+V)
  //console.log('Links: '+E)

  var nodes = {}
  var maxNode = 0
  for (var e = 0; e < E; e++) {
    var i = input.readInt()
    if (i > maxNode) maxNode = i
    var dest = input.readInt()
    var cost = input.readInt()/100
    if (!nodes[i]) nodes[i] = new Node(dest, cost)
    else nodes[i].dest.push({ 'node': dest, 'cost': cost })
  }
  // for (var i = 0; i <= maxNode; i++) {
  //   if (!nodes[i]) nodes[i] = new Node(i, 0)
  // }
  //console.log(require('util').inspect(nodes, {colors:1, depth:4}))

  console.log(isBuggy(nodes) ? 'True' : 'False')
}


