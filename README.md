# Consolify

Generate standalone HTML pages that turn the browser window into a console for
browserified JavaScript.

![consolify](http://maxantoni.de/img/consolify.png)

## Install with npm

```
$ npm install consolify
```

## Usage

```
$ browserify node_modules/consolify test.js | node_modules/.bin/consolify > test.html
```

Options:

```
-t, --title    Set the document title (defaults to "Consolify")
-r, --reload   Auto reload on change
```

See the [browser-reload][] documentation for details on `--reload`.

## Browserify & Mocha

Consolify works great with [Browserify][] and [Mocha][] through [Mocaccino][]:

```
$ browserify -p mocaccino node_modules/consolify ./test/*.js | node_modules/.bin/consolify > test/all.html
```

## API

```js
var consolify = require('consolify');

consolify(process.stdin, {
  title  : 'Consolify',
  reload : false
}).pipe(process.stdout);
```

## License

MIT

[browser-reload]: https://github.com/mantoni/browser-reload
[Mocha]: http://visionmedia.github.io/mocha/
[Browserify]: http://browserify.org
[Mocaccino]: https://github.com/mantoni/mocaccino.js
