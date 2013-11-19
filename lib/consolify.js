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
  .usage('Usage: $0 [--shim] [--mocha] [--title Title] [-o target] file1 file2 ...')
  .demand(1)
  .boolean('shim')
  .describe('shim', 'Prepend es5-shim')
  .boolean('mocha')
  .describe('mocha', 'Include mocha')
  .string('title')
  .describe('title', 'Web page title')
  .default('title', 'Consolify')
  .string('o')
  .describe('o', 'Output file to use. Defaults to stdout.')
  .argv;

var fs             = require('fs');
var listener       = require('listen')();
var browserify     = require('browserify')();
var modules        = __dirname + '/../node_modules/';
var preInitScript  = '';
var postInitScript = '';

argv._.forEach(function (arg) {
  browserify.add(arg);
});
browserify.bundle(listener('browserify'));

if (argv.shim) {
  fs.readFile(modules + 'es5-shim/es5-shim.min.js', listener('shim'));
}
if (argv.mocha) {
  var mochaFile = 'mocha/mocha.js';
  if (fs.existsSync('node_modules/' + mochaFile)) {
    fs.readFile('node_modules/' + mochaFile, listener('mocha'));
  } else {
    fs.readFile(modules + mochaFile, listener('mocha'));
  }
  fs.readFile(__dirname + '/mocha-reporter.js', listener('mochaReporter'));
  preInitScript  = 'mocha.setup(\'bdd\');mocha.reporter(ConsolifyReporter);';
  postInitScript = 'mocha.run();';
}

fs.readFile(__dirname + '/template.html', listener('template'));

listener.then(function (err, results) {
  if (err) {
    throw err;
  }
  var result = results.template.toString()
    .replace('<!--title-->', argv.title)
    .replace('/*shim*/', String(results.shim || ''))
    .replace('/*preinit*/', preInitScript)
    .replace('/*postinit*/', postInitScript)
    .replace('/*browserify*/', results.browserify.replace(/\$/g, '$$$$'))
    .replace('/*mocha*/', String((results.mocha || '') +
          (results.mochaReporter || '')).replace(/\$/g, '$$$$'));
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
