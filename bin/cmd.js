#!/usr/bin/env node
/*
 * consolify
 *
 * Copyright (c) 2013-2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var consolify = require('../lib/consolify');

var options = {};

var argv = process.argv.slice(2);
argv.forEach(function (a, i) {
  if (a === '--reload' || a === '-r') {
    options.reload = true;
  } else if (a === '--title' || a === '-t') {
    options.title = argv[i + 1];
    argv.splice(i + 1, 1);
  }
});

consolify(process.stdin, options).pipe(process.stdout);
