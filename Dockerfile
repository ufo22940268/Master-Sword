FROM node:12

RUN mkdir /code
WORKDIR /code

COPY package.json package-lock.json ./

RUN npm install

COPY tsconfig.json ./
COPY .env.production ./.env
COPY src ./src

RUN npm run build
EXPOSE 3000
ENTRYPOINT npm run serve

