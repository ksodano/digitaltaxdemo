FROM node:10.22.1

RUN apt-get update

RUN apt -y install python3-pip

RUN pip3 install --upgrade pip

RUN pip3 install boxdetect

RUN apt-get install 'ffmpeg'\
    'libsm6'\
    'libxext6'  -y

WORKDIR /api

COPY ./apidata /api/apidata
COPY ./bin /api/bin
COPY ./lib /api/lib
COPY ./node_modules /api/node_modules
COPY ./public /api/public
COPY ./routes /api/routes
COPY ./views /api/views
COPY ./app.js /api/app.js
COPY ./package.json /api/package.json


EXPOSE 2000

CMD ["npm","start"]