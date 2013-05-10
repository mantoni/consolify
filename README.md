# Consolify

Turn your browser window into a console and run Node modules via Browserify.

## Why?

Read the blog post: [How to run Node.js tests in your browser](http://maxantoni.de/blog/2013/04/how-to-run-nodejs-tests-in-your-browser.html)

![consolify](http://maxantoni.de/img/consolify.png)


## Install with NPM

```
$ npm install -g consolify
```

## Usage

```
$ consolify script.js > script.html
```

The generated HTML page has no external dependencies.

## Options

Prepend [es5-shim](https://github.com/kriskowal/es5-shim):

```
$ consolify --shim script.js > script.html
```

Append an auto-reload script:

```
$ consolify --reload -o script.html script.js
```

The reload script does HEAD requests every second and automatically reloads the page if the `Last-Modified` header changed.
Make sure the html is served by a web server.

Please refer to the [browser-reload][] documentation for further details.

[browser-reload]: https://github.com/mantoni/browser-reload

## Links

- [Browserify](http://browserify.org) does all the hard work
- Colors from <http://chriskempson.github.io/base16/>

## License

MIT
