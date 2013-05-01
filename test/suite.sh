. assert.sh/assert.sh

RUN="phantomjs test/phantom.js"

assert_raises "node ." 1

assert_raises "node . --shim" 1
assert_raises "node . ./something/unknown.js" 1

assert_raises "node . ./test/hello-info.js" 0
assert_raises "node . ./test/hello-warn.js" 0
assert_raises "node . ./test/hello-error.js" 0
assert_raises "node . ./test/throw.js" 0
assert_raises "node . --shim ./test/hello-info.js | $RUN" 0

assert "node . ./test/hello-info.js | $RUN" "INFO Oh, hi!"
assert "node . ./test/hello-warn.js | $RUN" "WARN Uh oh ..."
assert "node . ./test/hello-error.js | $RUN" "ERROR Ouch!"
assert "node . ./test/throw.js | $RUN" "ERROR Failed to load script: Error: Oh noes!"

assert "node . ./test/bind.js | $RUN" "LOG no"
assert "node . --shim ./test/bind.js | $RUN" "LOG yes"

assert_end