/*
 * consolify
 *
 * Copyright (c) 2013 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

function write(stream, then) {
  stream.pipe(process.stdout);
  stream.on('end', then);
}

var argv = require('optimist')
  .usage('Usage: $0 [--shim] [--title Title] [-o target] file1 file2 ...')
  .demand(1)
  .boolean('shim')
  .describe('shim', 'Prepend es5-shim')
  .string('title')
  .describe('title', 'Web page title')
  .default('title', 'Consolify')
  .string('o')
  .describe('o', 'Output file to use. Defaults to stdout.')
  .argv;

var fs         = require('fs');
var listener   = require('listen')();
var browserify = require('browserify')();
var modules    = __dirname + '/../node_modules/';

argv._.forEach(function (arg) {
  browserify.add(arg);
});
browserify.bundle(listener('browserify'));

if (argv.shim) {
  fs.readFile(modules + 'es5-shim/es5-shim.min.js', listener('shim'));
}

fs.readFile(__dirname + '/template.html', listener('template'));

listener.then(function (err, results) {
  if (err) {
    throw err;
  }
  var result = results.template.toString()
    .replace('<!--title-->', argv.title)
    .replace('/*shim*/', String(results.shim || ''))
    .replace('/*browserify*/', results.browserify.replace(/\$/g, '$$$$'));
  if (argv.o) {
    fs.writeFile(argv.o, result, function (err) {
      if (err) {
        throw err;
      }
    });
  } else {
    process.stdout.write(result);
  }
});
