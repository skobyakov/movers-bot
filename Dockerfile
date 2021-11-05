FROM node:16-alpine as development
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn run prebuild && yarn run build

FROM node:16-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --prod
COPY . .
COPY --from=development /app/dist ./dist
CMD ["yarn", "run", "start:prod"]
