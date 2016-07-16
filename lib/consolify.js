/*
 * consolify
 *
 * Copyright (c) 2013-2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var through = require('through2');
var mapper  = require('source-mapper');
var fs      = require('fs');
var path    = require('path');
var util    = require('./util');

var template = __dirname + '/consolify.html';
var styles   = __dirname + '/consolify.css';
var reload   = __dirname + '/../node_modules/browser-reload/reload.js';

var markerTitle        = '{title}';
var markerStyles       = '<!--styles-->';
var markerError        = '<!--error-->';
var markerSourceMap    = '/*source_map*/';
var markerSourceOffset = '/*source_offset*/';
var markerScript       = '/*script*/';
var markerBundle       = '<!--bundle-->';

function resolvePath(outfile, bundle) {
  if (!outfile) {
    return bundle;
  }
  // if we know where the html is going to be written we can
  // ensure the <script> tag points to the correct relative
  // path, see https://github.com/mantoni/mochify.js/issues/140
  return path.relative(path.dirname(outfile), bundle);
}

function generate(title, template, styles, script, bundle, reload, error,
    outfile, out) {
  var mapped = mapper.extract(script);
  var js = mapped.js;
  if (reload) {
    if (bundle) {
      js = reload;
    } else {
      js += reload;
    }
  } else if (bundle) {
    js = '';
  }

  var html = '';
  var bpath = resolvePath(outfile, bundle);
  var p = [
    [markerTitle, title],
    [markerStyles, '<style>' + styles + '</style>'],
    [markerError, error ? '<pre class="ansi-red-fg">' + error + '</pre>' : ''],
    [markerSourceMap, JSON.stringify(mapped.map)],
    [markerSourceOffset, String(styles.split('\n').length + 12)],
    [markerScript, js],
    [markerBundle, bpath ? '<script src="' + bpath + '"></script>' : '']
  ]
    .reduce(function (p, v) {
      var m = v[0];
      var n = template.indexOf(m, p);
      html += template.substring(p, n);
      html += v[1];
      return n + m.length;
    }, 0);
  html += template.substring(p);
  out.write(html);

  var tasks = [];
  if (bundle) {
    tasks.push(fs.writeFile.bind(fs, bundle, script));
  }
  if (outfile) {
    tasks.push(fs.writeFile.bind(fs, outfile, html));
  }
  util.series(tasks, function () {
    out.end();
  });
}


module.exports = function (b, options) {
  b.add('./' + path.relative(process.cwd(), path.resolve(__dirname, '..')));
  var title = options.title || options.t || 'Consolify';
  var bundle = options.bundle || options.b || '';
  var outfile = options.outfile || options.o || '';
  var templateContent;
  var stylesContent;
  var reloadContent;
  var count = 2;
  var then;
  var error;

  function dec(err) {
    if (err) {
      error = err;
    }
    if (--count === 0) {
      then(error);
    }
  }

  fs.readFile(template, 'utf8', function (err, content) {
    templateContent = content;
    dec(err);
  });
  fs.readFile(styles, 'utf8', function (err, content) {
    stylesContent = content;
    dec(err);
  });
  if (options.reload || options.r) {
    count++;
    fs.readFile(reload, 'utf8', function (err, content) {
      reloadContent = content;
      dec(err);
    });
  }

  var out;
  function apply() {
    error = null;
    out = through();
    var wrap = b.pipeline.get('wrap');
    var script;
    var done;

    then = function (err) {
      then = null;
      generate(
        title,
        templateContent,
        stylesContent,
        script,
        bundle,
        reloadContent,
        err,
        outfile,
        out
      );

      if (done) {
        out.on('end', done);
      }
    };

    count++;
    script = '';
    wrap.push(through(function (chunk, enc, next) {
      /*jslint unparam: true*/
      script += chunk;
      next();
    }, function (next) {
      if (then) {
        done = next;
        dec();
      } else {
        next();
      }
    }));
    wrap.push(out);
  }
  apply();
  b.on('reset', apply);
  b.on('bundle', function (bundle) {
    bundle.on('error', function (err) {
      dec(err);
    });
  });
};
