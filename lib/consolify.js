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
  .usage('Usage: $0 [--shim] file1 file2 ...')
  .demand(1)
  .boolean('shim')
  .describe('shim', 'Prepend es5-shim')
  .argv;

var fs         = require('fs');
var listener   = require('listen')();
var browserify = require('browserify')();

argv._.forEach(function (arg) {
  browserify.add(arg);
});
browserify.bundle(listener());

write(fs.createReadStream(__dirname + '/template-1.html'), function () {
  if (argv.shim) {
    write(fs.createReadStream(__dirname +
          '/../node_modules/es5-shim/es5-shim.min.js'), listener());
  }
  listener.then(function (err, results) {
    process.stdout.write(results[0]);
    write(fs.createReadStream(__dirname + '/template-2.html'), function () {});
  });
});
