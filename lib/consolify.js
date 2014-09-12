/*
 * consolify
 *
 * Copyright (c) 2013-2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var through = require('through2');
var listen  = require('listen');
var mapper  = require('source-mapper');
var fs      = require('fs');

var template = __dirname + '/consolify.html';
var styles   = __dirname + '/consolify.css';
var reload   = __dirname + '/../node_modules/browser-reload/reload.js';

function readScript(input, callback) {
  var s = '';
  input.on('data', function (chunk) {
    s += chunk;
  });
  input.on('end', function () {
    callback(null, s);
  });
}

var markerTitle        = '{title}';
var markerStyles       = '<!--styles-->';
var markerSourceMap    = '/*source_map*/';
var markerSourceOffset = '/*source_offset*/';
var markerScript       = '/*script*/';

module.exports = function (input, options) {

  var out = through();
  var listener = listen();
  readScript(input, listener('script'));
  fs.readFile(template, 'utf8', listener('tmpl'));
  fs.readFile(styles, 'utf8', listener('styles'));
  if (options.reload) {
    fs.readFile(reload, 'utf8', listener('reload'));
  }
  listener.then(function (err, results) {
    if (err) {
      // FIXME proper error handling
      out.end();
      return;
    }
    var script = results.script;
    var mapped = mapper.extract(script);
    script = mapped.js;
    if (results.reload) {
      script += results.reload;
    }

    var styles = '<style>' + results.styles + '</style>';

    var tmpl = results.tmpl;

    var p = [
      [markerTitle, options.title || 'Consolify'],
      [markerStyles, styles],
      [markerSourceMap, JSON.stringify(mapped.map)],
      [markerSourceOffset, String(styles.split('\n').length + 12)],
      [markerScript, script]
    ]
      .reduce(function (p, v) {
        var m = v[0];
        var n = tmpl.indexOf(m, p);
        out.write(tmpl.substring(p, n));
        out.write(v[1]);
        return n + m.length;
      }, 0);

    out.write(tmpl.substring(p));
    out.end();
  });

  return out;
};
