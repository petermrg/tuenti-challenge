#!/usr/bin/env node
// Challenge 11 - Escape from Pixel Island
// by Pedro Ladaria <pedro.ladaria@gmail.com>

/*
 IMPORTANT !!!

 Requires: libcairo2, canvas and jsqrcode

 $ sudo apt-get install libcairo2-dev
 $ npm install canvas
 $ npm install jsqrcode

*/

var Canvas = require('canvas')
var fs = require('fs')
var qrcode = require('jsqrcode')(Canvas)

var whitespace = [' ','\n','\r','\t']

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

Input.prototype.readInt = function() { return parseInt(this.read()) }

var input = new Input()

var Node = function(c) {
  this.type = c
  this.childs = []
  debug1+= c
}

var debug1 = '';

function clone(src) { // ripped from Dojo Toolkit
  function mixin(dest, source, copyFunc) {
    var name, s, i, empty = {};
    for(name in source){
      s = source[name];
      if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
        dest[name] = copyFunc ? copyFunc(s) : s;
      }
    }
    return dest;
  }
  if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
    return src; // anything
  }
  if(src.nodeType && "cloneNode" in src) return src.cloneNode(true); // Node
  var r, i, l;
  if(src instanceof Array){
    r = [];
    for(i = 0, l = src.length; i < l; ++i){
      if(i in src){
        r.push(clone(src[i]));
      }
    }
  }
  else {
    r = src.constructor ? new src.constructor() : {};
  }
  return mixin(r, src, clone);
}

var getChilds = function(node, s) {
  var c = []
  var p = []
  for (var i = 0; i < 4; i++) {
    c.push(new Node(s[i]))
    if (c[i].type == 'p') p.push(c[i])
  }
  node.childs = c
  return p
}

var makeTree = function(s) {
  var pending = []
  var i = 0
  var root = new Node(s[i++])
  if (root.type == 'p') {
    s = s.substr(1)
    pending = getChilds(root, s)
    s = s.substr(4)
  }
  while (pending.length > 0) {
    pending = pending.concat(getChilds(pending[0], s))
    pending.shift()
    s = s.substr(4)
  }
  return root
}

var sumTrees = function(t1, t2) {
  if (t1.type == 'b' || t2.type == 'b') return new Node('b')
  if (t1.type == 'w') return clone(t2)
  if (t2.type == 'w') return clone(t1)
  var tr = new Node('p')
  for (var i = 0; i < 4; i++) tr.childs[i] = sumTrees(t1.childs[i], t2.childs[i])
  return tr
}

var encodeChilds = function(node, pending) {
  var s = ''
  for (var i = 0; i < 4; i++) {
    s+= node.childs[i].type
    if (node.childs[i].type == 'p') pending.push(node.childs[i])
  }
  return s
}

var encodeTree = function(t) {
  var pending = []
  var s = t.type
  if (t.type == 'p') s+= encodeChilds(t, pending)
  while (pending.length > 0) {
    s+= encodeChilds(pending[0], pending)
    pending.shift()
  }
  return s
}

// var div = function(node) {
//   var s = ''
//   if (node.type == 'b') s+='<div class="W100 BL"></div>'
//   else if (node.type == 'w') s+='<div class="W100 WH"></div>'
//   else if (node.type == 'p') {
//     s+='<div class="W50 WH">'+div(node.childs[1])+'</div>'
//     s+='<div class="W50 WH">'+div(node.childs[0])+'</div>'
//     s+='<div class="W50 WH">'+div(node.childs[2])+'</div>'
//     s+='<div class="W50 WH">'+div(node.childs[3])+'</div>'
//   }
//   return s
// }
// var tree2HTML = function(t) {
//   s = '<style>div{display:inline-block;margin:-1px;border:1px solid #fff} .W50{width:50%;height:50%} '+
//     '.W100{width:100%; height:100%} .BL{background:#000;} .WH{background:#fff;}</style>'
//   s+= '<div style="width:600px;height:600px;border:0;margin:100px;">'
//   s+= div(t)
//   s+= '</div>'
//   return s;
// }

var drawNode = function(node, ctx, x1, y1, x2, y2) {
  if (node.type == 'b') ctx.fillBox(x1, y1, x2, y2, '#000')
  else if (node.type == 'w') ctx.fillBox(x1, y1, x2, y2, '#fff')
  else if (node.type == 'p') {
    var w = (x2-x1)/2
    drawNode(node.childs[1], ctx, x1, y1, x1+w, y1+w)
    drawNode(node.childs[0], ctx, x1+w, y1, x2, y1+w)
    drawNode(node.childs[2], ctx, x1, y1+w, x1+w, y2)
    drawNode(node.childs[3], ctx, x1+w, y1+w, x2, y2)
  }
}

var tree2PNG = function(tree, w, h) {
  var canvas = new Canvas(w, h)
  var ctx = canvas.getContext('2d')
  ctx.fillBox = function(x1, y1, x2, y2, color) {
    this.fillStyle = color
    this.fillRect(x1, y1, x2-x1, y2-y1)
  }
  ctx.fillBox(0, 0, w, h, '#fff')
  drawNode(tree, ctx, 0, 0, w, h)
  return canvas.toBuffer()
}

var T = input.readInt()

for (var t = 1; t <= T; t++) {
  var ta = makeTree(input.read())
  var tb = makeTree(input.read())
  var tc = sumTrees(ta, tb)
  var img = new Canvas.Image;
  img.src = tree2PNG(tc, 512, 512)
  console.log(qrcode.decode(img).trim())
}
