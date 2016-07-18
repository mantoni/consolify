# Changes

## 2.2.0

- Add `--outfile` arg (Jonny Reeves)

## 2.1.0

- Streams 3: bump dependencies

## 2.0.1

- Update through2 to `1.1`

## 2.0.0

- Refactor into a browserify plugin
- Add `--bundle` feature to export JS as a separate file
- Support short `-r` as an alias for `--reload` and `-t` for `--title`
- Fix auto scrolling

## 1.0.0

- Rewrite: Map stack traces back to original sources and split up template
- Fix auto scrolling

## 0.8.0

Breaking change! Now only works with Browserify!

- Consolify must be added to browserify as an entry
- Support stdout and ANSI colors
- Support cursor move to clear line
- Use base 16 color scheme

## 0.7.0

Breaking change! Completely rewrote the node code and test cases.

- Consolify is not a browserify wrapper anymore. Although browserifies output
  can still be piped to consolify.
- Removed `--mocha` and `--js` options. Use [Mocaccino][] and pipe the output
  to consolify instead.
- Added `--reload` option

[Mocaccino]: https://github.com/mantoni/mocaccino.js

## 0.6.0

- Added `--js` option to only generate the JavaScript
- Generating source maps

## 0.5.0

- Added `--mocha` option to use Mocha as a test framework

## 0.4.1

- Added `--title` option to set the title of the generated web page

## 0.4.0

- Removed `--reload` option and dependency to browser-reload again
- Fixed an issue with $ not being escaped in replace

## 0.3.0

- New `-o target` option writes output to a file. Defaults to stdout.
- New `--reload` option includes the [browser-reload][] script

[browser-reload]: https://github.com/mantoni/browser-reload

## 0.2.0

- Print usage if called without arguments
- Prepend es5-shim with the `--shim` option
- Test cases

## 0.1.1

- Deferred execution for faster UI feedback

## 0.1.0

- Initial release
