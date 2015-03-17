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

var markerTitle        = '{title}';
var markerStyles       = '<!--styles-->';
var markerSourceMap    = '/*source_map*/';
var markerSourceOffset = '/*source_offset*/';
var markerScript       = '/*script*/';

function generate(title, template, styles, script, reload, out) {
  var mapped = mapper.extract(script);
  script = mapped.js;
  if (reload) {
    script += reload;
  }

  var p = [
    [markerTitle, title],
    [markerStyles, '<style>' + styles + '</style>'],
    [markerSourceMap, JSON.stringify(mapped.map)],
    [markerSourceOffset, String(styles.split('\n').length + 12)],
    [markerScript, script]
  ]
    .reduce(function (p, v) {
      var m = v[0];
      var n = template.indexOf(m, p);
      out.write(template.substring(p, n));
      out.write(v[1]);
      return n + m.length;
    }, 0);
  out.write(template.substring(p));
}


module.exports = function (b, options) {
  b.add(__dirname + '/..');

  var wrap = b.pipeline.get('wrap');
  var listener = listen();
  var scriptListener = listener('script');
  var out = through();
  var done;

  function launch() {
    fs.readFile(template, 'utf8', listener('template'));
    fs.readFile(styles, 'utf8', listener('styles'));
    if (options.reload) {
      fs.readFile(reload, 'utf8', listener('reload'));
    }
    listener.then(function (err, results) {
      if (err) {
        // FIXME proper error handling
        return;
      }
      generate(
        options.title || 'Consolify',
        results.template,
        results.styles,
        results.script,
        results.reload,
        out
      );
      done();
    });
  }

  var script;
  wrap.push(through(function (chunk, enc, next) {
    /*jslint unparam: true*/
    if (script === undefined) {
      script = '';
      launch();
    }
    script += chunk;
    next();
  }, function (next) {
    done = next;
    scriptListener(null, script);
  }));
  wrap.push(out);
};
