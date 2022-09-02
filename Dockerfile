##사용 할 node version
#FROM node:16-alpine
##작업 공간 경로
#WORKDIR /sample
##
#COPY package.json /sample
#COPY . /sample
#RUN #npm install
#RUN npm run build
#CMD ["node","/sample/dist/main.js"]

FROM ubuntu:18.04
ADD sample-game-server ./
RUN apt-get update
RUN apt-get install -y telnet curl
CMD ./sample-game-server
EXPOSE 3000
