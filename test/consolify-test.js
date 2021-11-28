/*
 * consolify.js
 *
 * Copyright (c) 2014-2015 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*globals describe, it, afterEach*/
'use strict';

var assert     = require('assert');
var http       = require('http');
var fs         = require('fs');
var exec       = require('child_process').exec;
var browserify = require('browserify');
var through    = require('through2');
var consolify  = require('../lib/consolify');
var util       = require('../lib/util');
var sandbox    = require('./fixture/sandbox');


function bundle(script, opts) {
  var b = browserify({ debug : true });
  b.plugin(consolify, opts);
  b.add('./test/fixture/' + script);
  return b.bundle();
}

function br(script, opts, done, callback) {
  var phantom = exec('phantomjs test/fixture/phantom.js', function (err, out) {
    if (err) {
      done(err);
    } else {
      callback(out.split(/(?:<br>)+/g));
      done();
    }
  });
  bundle(script, opts).pipe(phantom.stdin);
}

describe('consolify', function () {
  this.timeout(5000);

  it('prints console log, info, warn and error', function (done) {
    br('console.js', {}, done, function (lines) {
      assert.deepEqual(lines[0], 'log');
      assert.deepEqual(lines[1], 'info');
      assert.deepEqual(lines[2], 'warn');
      assert.deepEqual(lines[3], 'error');
    });
  });

  it('sets title to "Consolify" by default', function (done) {
    br('title.js', {}, done, function (lines) {
      assert.deepEqual(lines[0], 'Consolify');
    });
  });

  it('sets title as configured', function (done) {
    br('title.js', { title : 'CustomTitle' }, done, function (lines) {
      assert.deepEqual(lines[0], 'CustomTitle');
    });
  });

  it('prints ansi colors', function (done) {
    br('colors.js', {}, done, function (lines) {
      assert.deepEqual(lines[0], '<span class="ansi-black-fg">Test</span>');
      assert.deepEqual(lines[1], '<span class="ansi-red-fg">Test</span>');
      assert.deepEqual(lines[2], '<span class="ansi-green-fg">Test</span>');
      assert.deepEqual(lines[3], '<span class="ansi-yellow-fg">Test</span>');
      assert.deepEqual(lines[4], '<span class="ansi-blue-fg">Test</span>');
      assert.deepEqual(lines[5], '<span class="ansi-magenta-fg">Test</span>');
      assert.deepEqual(lines[6], '<span class="ansi-cyan-fg">Test</span>');
      assert.deepEqual(lines[7], '<span class="ansi-white-fg">Test</span>');

      assert.deepEqual(lines[8], '<span class="ansi-black-bg">Test</span>');
      assert.deepEqual(lines[9], '<span class="ansi-red-bg">Test</span>');
      assert.deepEqual(lines[10], '<span class="ansi-green-bg">Test</span>');
      assert.deepEqual(lines[11], '<span class="ansi-yellow-bg">Test</span>');
      assert.deepEqual(lines[12], '<span class="ansi-blue-bg">Test</span>');
      assert.deepEqual(lines[13], '<span class="ansi-magenta-bg">Test</span>');
      assert.deepEqual(lines[14], '<span class="ansi-cyan-bg">Test</span>');
      assert.deepEqual(lines[15], '<span class="ansi-white-bg">Test</span>');
    });
  });

  it('replaces spaces with &nbsp;', function (done) {
    br('spaces.js', {}, done, function (lines) {
      assert.equal(lines[0], '&amp;nbsp;&amp;nbsp;Foo&amp;nbsp;Bar');
    });
  });

  it('clears line with Esc[2K', function (done) {
    br('clear-line.js', {}, done, function (lines) {
      assert.equal(lines[0], 'First');
      assert.equal(lines[1], 'Replaced');
      assert.equal(lines[2], 'Sup?');
    });
  });

  it('ignores Esc[0G for now', function (done) {
    br('clear-tab.js', {}, done, function (lines) {
      assert.equal(lines[0], '123');
    });
  });

  // Currently broken, skipping test
  it.skip('maps stack trace back to original source', function (done) {
    br('stack.js', {}, done, function (lines) {
      assert.equal(lines[0].replace(/&nbsp;/g, ' '), 'Error: ouch!');
      assert.equal(lines[1].replace(/&nbsp;/g, ' '),
          '      at test/fixture/stack.js:4');
    });
  });

  it('shows browserify error', function (done) {
    br('broken.md', {}, done, function (lines) {
      assert.deepEqual(lines[0], '<pre class="ansi-red-fg">'
        + process.cwd()
        + '/test/fixture/broken.md:1\nThis ain\'t no JavaScript\n     ^\n'
        + 'ParseError: Unexpected token</pre>\n');
    });
  });

});


describe('bundle', function () {
  this.timeout(3000);

  function collect(callback) {
    var html = '';
    return through(function (chunk, enc, next) {
      /*jslint unparam: true*/
      html += chunk;
      next();
    }, function (next) {
      next();
      callback(html);
    });
  }

  it('inserts script for bundle', sandbox(function (done, tmpdir) {
    bundle('console.js', { bundle : tmpdir + '/bundle.js' })
      .pipe(collect(function (h) {
        assert.notEqual(
          h.indexOf('<script src="' + tmpdir + '/bundle.js">'),
          -1
        );
        done();
      }));
  }));

  it('does not inserts script if no bundle configured', function (done) {
    bundle('console.js', {}).pipe(collect(function (h) {
      assert.equal(h.indexOf('<script src='), -1);
      done();
    }));
  });

  it('writes script to bundle path', sandbox(function (done, tmpdir) {
    bundle('console.js', { bundle : tmpdir + '/bundle.js' })
      .pipe(collect(function () {
        fs.exists(tmpdir + '/bundle.js', function (exists) {
          assert(exists);
          done();
        });
      }));
  }));

  it('writes html to outfile path', sandbox(function (done, tmpdir) {
    bundle('console.js', { outfile : tmpdir + '/out.html' })
      .pipe(collect(function () {
        fs.exists(tmpdir + '/out.html', function (exists) {
          assert(exists);
          done();
        });
      }));
  }));

  it('writes both html and the bundle', sandbox(function (done, tmpdir) {
    bundle('console.js', {
      outfile : tmpdir + '/out.html',
      bundle : tmpdir + '/bundle.js'
    })
      .pipe(collect(function () {
        fs.exists(tmpdir + '/out.html', function (htmlExists) {
          assert(htmlExists, 'html exists');
          fs.exists(tmpdir + '/bundle.js', function (bundleExists) {
            assert(bundleExists, 'bundle exists');
            done();
          });
        });
      }));
  }));

  it('resolves the bundle path relative to the html',
    sandbox(function (done, tmpdir) {
      fs.mkdir(tmpdir + '/tmp', function (err) {
        if (err) {
          return done(err);
        }
        bundle('console.js', {
          outfile : tmpdir + 'tmp/out.html',
          bundle : tmpdir + 'tmp/bundle.js'
        })
          .pipe(collect(function (h) {
            assert.notEqual(
              h.indexOf('<script src="bundle.js">'),
              -1
            );
            done();
          }));
      });
    }));

});
