default: assert.sh
	@test/suite.sh

assert.sh:
	git clone https://github.com/lehmannro/assert.sh

version := $(shell node -e "console.log(require('./package.json').version)")

release:
ifeq (v${version},$(shell git tag -l v${version}))
	@echo "Version ${version} already released!"
endif
	@make
	@echo "Creating tag v${version}"
	@git tag -a -m "Release ${version}" v${version}
	@git push --tags
	@echo "Publishing to NPM"
	@npm publish
