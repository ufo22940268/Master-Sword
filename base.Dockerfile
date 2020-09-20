FROM node:12

RUN mkdir /code
WORKDIR /code

COPY package.json package-lock.json ./

RUN npm install

