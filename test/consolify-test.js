/*
 * consolify.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*globals describe, it*/
'use strict';

var assert     = require('assert');
var fs         = require('fs');
var exec       = require('child_process').exec;
var browserify = require('browserify');
var through    = require('through');

var consolify = require('../lib/consolify');


function br(script, opts, done, callback) {
  var phantom = exec('phantomjs test/fixture/phantom.js', function (err, out) {
    if (err) {
      done(err);
    } else {
      callback(out.split(/(?:<br>)+/g));
      done();
    }
  });
  var b = browserify();
  b.add('./', { expose : 'consolify' });
  b.add('./test/fixture/' + script);
  var t = through();
  b.bundle().pipe(t);
  consolify(t, opts).pipe(phantom.stdin);
}


describe('consolify', function () {
  this.timeout(3000);

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
    br('title.js', { title : 'Some Test' }, done, function (lines) {
      assert.deepEqual(lines[0], 'Some Test');
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

});
