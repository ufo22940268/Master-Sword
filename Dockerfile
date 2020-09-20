FROM node:12

RUN mkdir /code
WORKDIR /code

COPY package.json package-lock.json ./

RUN npm install

COPY tsconfig.json ./
COPY .env ./.env
COPY src ./src

#RUN npm run build
EXPOSE 3000

ENV NODE_ENV production
ENTRYPOINT npm run serve-ts

