/*
 * consolify
 *
 * Copyright (c) 2013 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var through = require('through');
var fs      = require('fs');

var template1 = __dirname + '/template1.html';
var template2 = __dirname + '/template2.html';
var template3 = __dirname + '/template3.html';
var reload    = __dirname + '/../node_modules/browser-reload/reload.js';

function write(out, stream, then) {
  stream.on('data', function (chunk) {
    out.write(chunk);
  });
  stream.on('end', then);
}

function tail(out) {
  write(out, fs.createReadStream(template3), function () {
    out.end();
  });
}

module.exports = function (input, options) {
  var out = through();
  write(out, fs.createReadStream(template1), function () {
    out.write(options.title || 'Consolify');
    write(out, fs.createReadStream(template2), function () {
      write(out, input, function () {
        if (options.reload) {
          write(out, fs.createReadStream(reload), function () {
            tail(out);
          });
        } else {
          tail(out);
        }
      });
    });
  });
  return out;
};
