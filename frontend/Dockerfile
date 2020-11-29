FROM node:10.22.1


WORKDIR /front

COPY node_modules /front/node_modules
COPY public /front/public
COPY src /front/src
COPY package.json /front/package.json
COPY tsconfig.json /front/tsconfig.json

CMD ["npm","start"]