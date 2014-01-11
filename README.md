# Consolify

Generate standalone HTML pages that turn the browser window into a console

![consolify](http://maxantoni.de/img/consolify.png)

## Install with npm:

```
$ npm install consolify -g
```

## Usage

Pipe any script to the consolify command:

```
$ cat test.js | consolify > test.html
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
$ browserify ./test/*.js | mocaccino -b | consolify > test/all.html
```

## License

MIT

[browser-reload]: https://github.com/mantoni/browser-reload
[Mocha]: http://visionmedia.github.io/mocha/
[Browserify]: http://browserify.org
[Mocaccino]: https://github.com/mantoni/mocaccino.js
