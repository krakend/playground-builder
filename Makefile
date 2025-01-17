.PHONY: all install start_ce start_ee build_ce build_ee

all: install start_ce

install:
	docker run -it --rm -v ${PWD}:/app -w /app node:18-alpine npm install

start_ce:

	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=open-source" -p "3000:3000" node:18-alpine npm run dev

start_ee:

	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=enterprise" -p "3000:3000" node:18-alpine npm run dev

build_ce:

	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=open-source" node:18-alpine npm run build

build_ee:

	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=enterprise" node:18-alpine npm run build
