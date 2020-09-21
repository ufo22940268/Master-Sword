FROM node:12

RUN mkdir /code
WORKDIR /code

COPY tsconfig.json ./
COPY .env ./.env
COPY keys ./keys
COPY package.json package-lock.json ./

RUN npm install

COPY src ./src

EXPOSE 3000

ENV NODE_ENV production
CMD npm run serve-ts
