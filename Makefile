.PHONY: all install start_ce start_ee build_ce build_ee serve_static

all: install start_ce

install:

	docker run -it --rm -v ${PWD}:/app -w /app node:23-alpine npm install

start_ce:

	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=open-source" -p "3000:3000" node:23-alpine npm run dev

start_ee:

	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=enterprise" -p "3000:3000" node:23-alpine npm run dev

build_ce:

	cp ../playground-community/config/krakend/krakend.json public/demo/data/krakend.json
	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=open-source" node:23-alpine npm run build
	rm -fr ../playground-community/config/krakend/demo
	cp -R out ../playground-community/config/krakend/demo

build_ee:

	cp ../playground-enterprise/config/krakend/krakend.json public/demo/data/krakend.json
	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=enterprise" node:23-alpine npm run build
	rm -fr ../playground-enterprise/config/krakend/demo
	cp -R out ../playground-enterprise/config/krakend/demo

serve_static:
	docker run -it -v "${PWD}/out:/usr/share/nginx/html/demo" -p "8080:80" nginx
