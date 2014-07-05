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

function append(msg) {
  div.innerHTML = ansi.ansi_to_html(ansi.escape_for_html(msg), {
    use_classes : true
  }).replace(/^\s+/gm, function (m) {
    return m.replace(/ /g, '&nbsp;');
  }).replace(/^<span class="([a-z\-]+)">(\s+)/gm, function (m, p1, p2) {
    /*jslint unparam: true*/
    return '<span class="' + p1 + '">' + p2.replace(/ /g, '&nbsp;');
  }).replace(/\n/gm, '<br>');
  Array.prototype.slice.call(div.childNodes).forEach(function (node) {
    body.appendChild(node);
  });
  body.scrollTop = body.offsetHeight;
}

brout.on('out', append);
brout.on('err', append);
brout.on('exit', function (code) {
  body.appendChild(document.createElement('hr'));
  append('\u001b[1;30mexit(' + code + ')\u001b[0m');
});
