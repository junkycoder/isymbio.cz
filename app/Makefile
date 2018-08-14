generate: node_modules
	npx metalsmith
	mkdir ../web/assets
	cp assets/* ../web/assets
	rm ../web/assets/custom.css
	ln assets/custom.css ../web/assets/custom.css

node_modules: package.json
	npm install

static:
	open http://localhost:6969/
	pushd ../web; python -m SimpleHTTPServer 6969; popd

.PHONY: generate