IMAGE := rodrigocardoso/labirinto-scraper:1.1.2

image:
	docker build -t $(IMAGE) .

push-image:
	docker push $(IMAGE)

.PHONY: image push-image