/*global document, phantom*/
'use strict';

var content = require('system').stdin.read();
var page    = require('webpage').create();

page.onLoadFinished = function () {
  setTimeout(function () {
    var html = page.evaluate(function () {
      return document.getElementById('consolify').innerHTML;
    });
    console.log(html);
    phantom.exit();
  }, 10);
};

page.content = content;
