install: install-deps
	npx simple-git-hooks
install-deps:
	npm ci
lint:
	npx eslint .
link:
	sudo npm link --force
test:
	npm run test
test-coverage:
	npm test -- --coverage --coverageProvider=v8
gendiff:
	node bin/gendiff.js
publish:
	npm publish
