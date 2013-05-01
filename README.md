# Consolify

Turn your browser window into a console and run Node modules via Browserify.

## Why?

Blog post: [How to run Node.js tests in your browser](http://maxantoni.de/blog/2013/04/how-to-run-nodejs-tests-in-your-browser.html)

![consolify](http://maxantoni.de/img/consolify.png)


## Install with NPM

```
$ npm install -g consolify
```

## Usage

```
$ consolify script.js > script.html
```

Optionally prepend [es5-shim](https://github.com/kriskowal/es5-shim):

```
$ consolify --shim script.js > script.html
```

The generated HTML page has no external dependencies.

## Links

- [Browserify](http://browserify.org) does all the hard work
- Colors from <http://chriskempson.github.io/base16/>
