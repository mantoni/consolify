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

function append(msg) {
  msg = msg.replace(/\u001b\[(2K|0G)/g, ''); // remove clear escapes
  div.innerHTML = ansi.ansi_to_html(ansi.escape_for_html(msg), {
    use_classes : true
  }).replace(/^\s+/gm, function (m) {
    return m.replace(/ /g, '&nbsp;');
  }).replace(/^<span class="([a-z\-]+)">(\s+)/gm, function (m, p1, p2) {
    /*jslint unparam: true*/
    return '<span class="' + p1 + '">' + p2.replace(/ /g, '&nbsp;');
  }).replace(/\n/gm, '<br>');
  Array.prototype.slice.call(div.childNodes).forEach(function (n) {
    node.appendChild(n);
  });
  body.scrollTop = body.offsetHeight;
}

brout.on('out', append);
brout.on('err', append);
brout.on('exit', function (code) {
  node.appendChild(document.createElement('hr'));
  append('\u001b[1;30mexit(' + code + ')\u001b[0m');
});
