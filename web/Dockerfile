# build environment
FROM node:10.15.1-alpine as build
WORKDIR /app
RUN npm install -g yarn@1.17.3
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN yarn
COPY . /app
ARG REACT_APP_SERVER_URL
RUN echo REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL > .env
RUN yarn build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/
CMD sed -i -e 's/PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'