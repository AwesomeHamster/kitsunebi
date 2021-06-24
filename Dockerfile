# syntax=docker/dockerfile:1

FROM node:14-alpine as builder

WORKDIR /app
COPY . .

RUN yarn install && yarn run build


FROM node:14-alpine as prod

WORKDIR /app

COPY --from=0 /app/dist /app
COPY --from=0 /app/package.json /app/package.json

RUN yarn install --prod && yarn link

CMD [ "kitsunebi" ]
