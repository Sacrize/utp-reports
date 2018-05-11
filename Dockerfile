FROM node:8.10
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .
CMD node app
EXPOSE 9000