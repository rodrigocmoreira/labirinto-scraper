FROM mhart/alpine-node:8

COPY . /opt/labirinto-scraper
WORKDIR /opt/labirinto-scraper

RUN npm install --production

EXPOSE 4100

CMD [ "npm", "start" ]