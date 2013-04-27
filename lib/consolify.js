/*
 * consolify
 *
 * Copyright (c) 2013 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

if (process.argv.length < 3) {
  process.stdout.write('No files given\n');
  process.exit(1);
}

var browserify = require('browserify');
var fs         = require('fs');

function write(stream, then) {
  stream.pipe(process.stdout);
  stream.on('end', then);
}

write(fs.createReadStream(__dirname + '/template-1.html'), function () {
  var args = Array.prototype.slice.call(process.argv, 2);
  var b    = browserify();
  args.forEach(function (arg) {
    b.add(arg);
  });
  write(b.bundle(), function () {
    write(fs.createReadStream(__dirname + '/template-2.html'), function () {});
  });
});
