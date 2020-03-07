# build environment
FROM node:10.15.1-alpine as build
WORKDIR /app
RUN npm config set unsafe-perm true
RUN npm install -g yarn@1.17.3
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn
COPY . /app
RUN yarn build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
CMD nginx -g 'daemon off;'