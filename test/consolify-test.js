/*
 * consolify.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*globals describe, it*/
'use strict';

var assert = require('assert');
var exec   = require('child_process').exec;
var fs     = require('fs');

var consolify = require('../lib/consolify');

function run(cmd, done, cb) {
  return exec(cmd, function (err, stdout) {
    if (err) {
      done(err);
    } else {
      cb(stdout);
    }
  });
}

function fork(cmd, done, then) {
  return run(cmd, done, function (stdout) {
    var node = run('phantomjs test/fixture/phantom.js', done, then);
    node.stdin.write(stdout);
    node.stdin.end();
  });
}

function assertOutput(cmd, script, done, then) {
  var proc = fork(cmd, done, then);
  proc.stdin.write(script);
  proc.stdin.end();
}

describe('consolify', function () {
  this.timeout(3000);

  it('prints console log info warn error', function (done) {
    assertOutput('bin/cmd.js', 'console.log("a");' +
      'console.info("b");' +
      'console.warn("c");' +
      'console.error("d");', done, function (stdout) {
        assert.equal(stdout, 'LOG a\nINFO b\nWARN c\nERROR d\n');
        done();
      });
  });

  it('appends browser-reload', function (done) {
    fs.readFile('node_modules/browser-reload/reload.js',
      function (err, reload) {
        if (err) {
          done(err);
        } else {
          var proc = run('bin/cmd.js --reload', done, function (stdout) {
            assert(stdout.indexOf(reload.toString()) !== -1);
            done();
          });
          proc.stdin.end();
        }
      });
  });

  it('uses default title', function (done) {
    assertOutput('bin/cmd.js', 'console.log(document.title);', done,
      function (stdout) {
        assert.equal(stdout, 'LOG Consolify\n');
        done();
      });
  });

  it('uses given title', function (done) {
    assertOutput('bin/cmd.js --title "Some Title"',
      'console.log(document.title);', done, function (stdout) {
        assert.equal(stdout, 'LOG Some Title\n');
        done();
      });
  });

});
