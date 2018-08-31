FROM mhart/alpine-node:8

COPY . /app/labirinto-scraper
WORKDIR /app/labirinto-scraper

RUN npm install --production

EXPOSE 4100

CMD [ "npm", "start" ]