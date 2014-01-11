var content = require('system').stdin.read();
var page    = require('webpage').create();

page.onLoadFinished = function () {

  setTimeout(function () {

    var lines = page.evaluate(function () {
      var pres = document.getElementsByTagName('pre');
      return Array.prototype.slice.call(pres).map(function (pre) {
        return pre.className.toUpperCase() + ' ' + pre.innerText;
      });
    });

    lines.forEach(function (line) {
      console.log(line);
    });

    phantom.exit();

  }, 10);

};

page.content = content;
