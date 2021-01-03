FROM node:14

COPY ["package.json", "package-lock.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install

COPY ["./dist", "/usr/src/src"]

EXPOSE 3000

CMD ["npm", "run", "dev"]