FROM node
WORKDIR /usr/src/app
COPY ["./web/package.json", "./web/package-lock.json", "./"] 
RUN npm install --production
COPY ./web ./
EXPOSE 3000
CMD npm start