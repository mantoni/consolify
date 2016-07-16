'use strict';

var tmp  = require('tmp');

// sandbox creates a temporary directory which will be automatically
// removed after the testcase completes.
function sandbox(testfn) {
  return function (done) {
    var tmpOpts = {
      unsafeCleanup: true
    };
    tmp.dir(tmpOpts, function (err, tmpdir) {
      if (err) {
        return done(err);
      }
      testfn(done, tmpdir);
    });
  };
}

module.exports = sandbox;