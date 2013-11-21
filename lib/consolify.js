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
  .usage('Usage: $0 [--shim] [--mocha] [--js] [--title Title] [-o target] ' +
         'file1 file2 ...')
  .demand(1)
  .boolean('shim')
  .describe('shim', 'Prepend es5-shim')
  .boolean('mocha')
  .describe('mocha', 'Include mocha')
  .boolean('js')
  .describe('js', 'Only print the JS')
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
browserify.bundle({
  debug : true
}, listener('browserify'));

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
}

if (!argv.js) {
  fs.readFile(__dirname + '/template1.html', listener('template1'));
  fs.readFile(__dirname + '/template2.html', listener('template2'));
}

listener.then(function (err, results) {
  if (err) {
    throw err;
  }
  var stream = argv.o ? fs.createWriteStream(argv.o) : process.stdout;
  if (!argv.js) {
    var template1 = results.template1.toString();
    stream.write(template1.replace('<!--title-->', argv.title));
  }
  if (results.shim) {
    stream.write(results.shim);
  }
  if (argv.mocha) {
    stream.write(results.mocha);
    stream.write(results.mochaReporter);
    stream.write('mocha.setup(\'bdd\');mocha.reporter(ConsolifyReporter);');
  }
  stream.write('setTimeout(function () { try {\n');
  stream.write(results.browserify);
  stream.write('\n} catch (e) {');
  stream.write(' console.error(\'Failed to load script: \' + e); }\n');
  if (argv.mocha) {
    stream.write('mocha.run();\n');
  }
  stream.write('}, 1);\n');
  if (!argv.js) {
    stream.write(results.template2);
  }
  if (argv.o) {
    stream.end();
  }
});
