FROM node:16.1.0

RUN apt-get update && \
  apt-get install -y vim chromium

WORKDIR /code/

ADD tsconfig.json package.json package.json /code/

RUN npm install

ADD src /code/src/
ADD test /code/test

RUN npm run build

ENTRYPOINT "/bin/sh"
