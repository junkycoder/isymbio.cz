generate: node_modules
	npx metalsmith
	rm -rf ../web/assets
	mkdir ../web/assets
	cp -f assets/* ../web/assets

node_modules: package.json
	npm install

static:
	open http://localhost:6969/
	pushd ../web; python -m SimpleHTTPServer 6969; popd

.PHONY: generate