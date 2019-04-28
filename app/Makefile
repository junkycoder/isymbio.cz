web: node_modules
	npx metalsmith

node_modules: package.json
	npm install

local:
	open http://localhost:6969/
	pushd ../web; python -m SimpleHTTPServer 6969; popd

.PHONY: generate