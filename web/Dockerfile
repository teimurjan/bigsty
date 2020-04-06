FROM node:12.14.0-alpine
WORKDIR /app
RUN npm config set unsafe-perm true
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN set http_proxy= && set https_proxy= && yarn config delete proxy && npm config rm https-proxy && npm config rm proxy
RUN yarn --network-timeout 1000000
COPY . /app
CMD yarn start