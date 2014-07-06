/*global document*/
/*
 * consolify
 *
 * Copyright (c) 2013-2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var brout = require('brout');
var ansi  = require('ansi_up');

var body = document.body;
var div  = document.createElement('div');
var node = document.getElementById('consolify');
var br;
var line = '';

function appendNode(n) {
  node.appendChild(n);
}

function appendLine(msg) {
  if (br) {
    while (br.nextSibling) {
      node.removeChild(br.nextSibling);
    }
  } else {
    while (node.lastChild) {
      node.removeChild(node.lastChild);
    }
  }
  var p = msg.lastIndexOf('\u001b[2K');
  if (p !== -1) {
    line = '';
    msg = msg.substring(p + 4);
  }
  line += msg;
  msg = ansi.escape_for_html(line);
  msg = msg.replace(/\u001b\[0G/g, '');
  msg = msg.replace(/ /g, '&nbsp;');
  div.innerHTML = ansi.ansi_to_html(msg, {
    use_classes : true
  });
  Array.prototype.slice.call(div.childNodes).forEach(appendNode);
}

function append(msg) {
  if (!msg) {
    return;
  }
  var p = msg.indexOf('\n');
  if (p === -1) {
    appendLine(msg);
  } else {
    appendLine(msg.substring(0, p));
    br = document.createElement('br');
    node.appendChild(br);
    line = '';
    append(msg.substring(p + 1));
  }
  body.scrollTop = body.offsetHeight;
}

brout.on('out', append);
brout.on('err', append);
brout.on('exit', function (code) {
  br = document.createElement('hr');
  node.appendChild(br);
  append('\u001b[1;30mexit(' + code + ')\u001b[0m');
});
