IMAGE := rodrigocardoso/labirinto-scraper:1.1.3

image:
	docker build -t $(IMAGE) .

push-image:
	docker push $(IMAGE)

tag:
	docker tag $(IMAGE) registry.heroku.com/labirinto-scraper/web ;

.PHONY: image push-image