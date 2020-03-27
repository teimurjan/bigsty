# build environment
FROM node:12.14.0-alpine as build
WORKDIR /app
RUN npm config set unsafe-perm true
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn --network-timeout 1000000
COPY . /app
RUN yarn build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
CMD nginx -g 'daemon off;'