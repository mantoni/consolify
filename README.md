# Consolify

Generate standalone HTML pages that turn the browser window into a console.

![consolify](http://maxantoni.de/img/consolify2.png)

- Designed for unit testing [Browserify][] output
- ANSI color support using [ANSI up][].
- Beautiful [Base 16][] color scheme

## Install with npm

```
$ npm install consolify
```

## Usage

```
$ browserify --debug ./node_modules/consolify ./test.js | node_modules/.bin/consolify > test.html
```

Options:

```
-t, --title    Set the document title (defaults to "Consolify")
-r, --reload   Auto reload on change
```

See the [browser-reload][] documentation for details on `--reload`.

## Browserify & Mocha

Consolify works great with [Mocha][] through [Mocaccino][]:

```
$ browserify -p [ mocaccino -R spec ] ./node_modules/consolify ./test/*.js | node_modules/.bin/consolify > test.html
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

[ANSI up]: https://github.com/drudru/ansi_up
[Base 16]: https://github.com/chriskempson/base16
[browser-reload]: https://github.com/mantoni/browser-reload
[Mocha]: http://visionmedia.github.io/mocha/
[Browserify]: http://browserify.org
[Mocaccino]: https://github.com/mantoni/mocaccino.js
