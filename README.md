# Consolify

Turn your browser window into a console that runs your Node unit test via [Browserify][].

## Features:

- Works with any test framework that reports to the `console`
- Mocha support
- ES5 Shim support
- Generate standalone HTML page or just the JavaScript with source maps

Read the original blog post: [How to run Node.js tests in your browser](http://maxantoni.de/blog/2013/04/how-to-run-nodejs-tests-in-your-browser.html)

![consolify](http://maxantoni.de/img/consolify.png)


## Usage

Install with npm:

```
$ npm install -g consolify
```

Run `consolify` in the same way as you would run Browserify:

```
$ consolify ./test/*-test.js > script.html
```

The generated HTML page has no external dependencies.

If you are using Mocha:

```
$ consolify --mocha ./test/*-test.js > script.html
```

Generate just the JavaScript and pipe it to [phantomic][] for immediate execution in PhantomJS:

[phantomic]: https://github.com/mantoni/phantomic

```
$ consolify --js ./test/*-test.js | phantomic
```

Prepending [es5-shim](https://github.com/kriskowal/es5-shim):

```
$ consolify --shim ./index.js > script.html
```

Write to a file instead of stdout:

```
$ consolify -o script.html ./index.js
```

See all available options by just running

```
$ consolify
```

Add [browser-reload][] to automatically reload the page on change:

```
$ npm install browser-reload
$ consolify -o script.html ./index.js browser-reload
```

Please refer to the [browser-reload][] documentation for further details.

[browser-reload]: https://github.com/mantoni/browser-reload

## Credits

- [Browserify](http://browserify.org) does all the hard work
- Colors from <http://chriskempson.github.io/base16/>

## License

MIT
