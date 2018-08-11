generate: node_modules
	npx metalsmith
	mkdir ../web/assets
	cp assets/* ../web/assets

node_modules: package.json
	npm install

static:
	ln -s ../web/ web
	open http://localhost:6969/
	pushd ./web; python -m SimpleHTTPServer 6969; popd

.PHONY: generate