#!/usr/bin/env node
// Challenge 9 - Defenders of the Galaxy

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
var width, height, soldierCost, crematoriumCost,
    remainingGold, map, startGold, time, full

var lasers = function(soldiersCount) {
  var round = width * height - soldiersCount * height
  if (map + round < full) {
    while (map + round < full) {
      time+= height-1
      map+= round
    }
  }
  else {
    map-= soldiersCount
    if (map < 0) map = 0
  }
}

var crematorium = function() {
  if ((map >= full) && remainingGold >= crematoriumCost) {
    var crematoriumsCount = Math.floor(remainingGold/crematoriumCost)
    remainingGold-= crematoriumCost * crematoriumsCount
    time*= crematoriumsCount
    map = 0
  }
}


while (T--) {
  width = input.readInt()
  height = input.readInt()
  soldierCost = input.readInt()
  crematoriumCost = input.readInt()
  startGold = input.readInt()

  var soldiersCount = Math.floor(startGold/soldierCost)
  if (soldiersCount >= width) {
    console.log(-1)
    continue
  }
  var sc = soldiersCount
  var allTimes = []
  full = width * (height - 1) + 1
  while (sc >= 0) {
    map = 0
    remainingGold = startGold - sc * soldierCost
    time = 0
    while (map < full) {
      time++
      map+=width
      lasers(sc)
      crematorium()
    }
    sc--
    allTimes.push(time)
  }
  console.log(Math.max.apply(Math, allTimes))
}
