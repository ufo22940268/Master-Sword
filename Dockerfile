FROM ufo22940268/biubiubiu-base

WORKDIR /code

COPY tsconfig.json ./
COPY .env ./.env
COPY src ./src

#RUN npm run build
EXPOSE 3000

ENV NODE_ENV production
CMD npm run serve-ts

