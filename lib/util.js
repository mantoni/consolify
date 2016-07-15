/*
 * consolify
 *
 * Copyright (c) 2013-2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

// series invokes the supplied array of functions (tasks) in order 
// before finally the supplied 'done' callback when all tasks have
// been executed.  Each task will be invoked with a callback function 
// which it should invoke when it has completed; should the task 
// supply an error to the callback then execution of subsiquent tasks 
// will be halted and the error propogated to the supplied 'done' 
// callback
exports.series = function (tasks, done) {
  function runTask(i) {
    if (i >= tasks.length) {
      return done();
    }
    tasks[i](function (err) {
      if (err) {
        return done(err);
      }
      runTask(i + 1);
    });
  }
  runTask(0);
};
