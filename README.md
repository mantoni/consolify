# Consolify

[![Build Status]](https://travis-ci.org/mantoni/consolify)
[![SemVer]](http://semver.org)
[![License]](https://github.com/mantoni/consolify/blob/master/LICENSE)

Generate standalone HTML pages that turn the browser window into a console.

![consolify](http://maxantoni.de/img/consolify2.png)

- Designed for [Browserify][]
- Source maps aware
- ANSI color support using [ANSI up][]
- Beautiful [Base 16][] color scheme

## Install with npm

```
$ npm install consolify
```

## Usage

```
$ browserify --debug --plugin [ consolify {options} ] ./test.js > test.html
```

Options:

```
-b, --bundle   Set the path to the JavaScript bundle to generate. A script tag
               with this path will be generated into the output HTML. If not
               specified, the bundle is inlined.
-r, --reload   Auto reload on change.
-t, --title    Set the document title. Defaults to "Consolify".
-o, --outfile  Write the standalone HTML page to the supplied path as well as
               passing it through to browserify
```

## Mocha support

Consolify works great with [Mocha][] through [Mocaccino][]:

```
$ browserify --plugin mocaccino --plugin consolify ./test/*.js > test.html
```

## Automatic reloads

If `--reload` is given, a HEAD request is made every second to check whether
the file was updated. This requires a web server that sends the `Last-Modified`
header. Learn more in the [browser-reload][] documentation.

## License

MIT

[Build Status]: http://img.shields.io/travis/mantoni/consolify.svg
[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/consolify.svg
[ANSI up]: https://github.com/drudru/ansi_up
[Base 16]: https://github.com/chriskempson/base16
[browser-reload]: https://github.com/mantoni/browser-reload
[Mocha]: http://mochajs.org
[Browserify]: http://browserify.org
[Mocaccino]: https://github.com/mantoni/mocaccino.js
