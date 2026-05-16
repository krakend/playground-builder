.PHONY: all install start_ce start_ee build_ce build_ee redact_credentials serve_static

all: install start_ce

install:

	docker run -it --rm -v ${PWD}:/app -w /app node:23-alpine npm install

start_ce:

	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=open-source" -p "3000:3000" node:23-alpine npm run dev

start_ee:

	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=enterprise" -p "3000:3000" node:23-alpine npm run dev

build_ce:

	cp ../playground-community/config/krakend/krakend.json public/demo/data/krakend.json
	$(MAKE) redact_credentials
	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=open-source" node:23-alpine npm run build
	rm -fr ../playground-community/config/krakend/demo
	cp -R out ../playground-community/config/krakend/demo

build_ee:

	cp ../playground-enterprise/config/krakend/krakend.json public/demo/data/krakend.json
	$(MAKE) redact_credentials
	docker run -it --rm -v ${PWD}:/app -w /app -e "NEXT_PUBLIC_KRAKEND_LICENSE_TYPE=enterprise" node:23-alpine npm run build
	rm -fr ../playground-enterprise/config/krakend/demo
	cp -R out ../playground-enterprise/config/krakend/demo

redact_credentials:

	sed -i '' \
		-e 's|"credentials": "AIza[^"]*"|"credentials": "<REDACTED_GEMINI_API_KEY>"|g' \
		-e 's|"credentials": "sk-proj-[^"]*"|"credentials": "<REDACTED_OPENAI_API_KEY>"|g' \
		-e 's|"credentials": "sk-ant-[^"]*"|"credentials": "<REDACTED_ANTHROPIC_API_KEY>"|g' \
		-e 's|key=AIza[^"&]*|key=<REDACTED_GEMINI_API_KEY>|g' \
		public/demo/data/krakend.json

serve_static:
	docker run -it -v "${PWD}/out:/usr/share/nginx/html/demo" -p "8080:80" nginx
