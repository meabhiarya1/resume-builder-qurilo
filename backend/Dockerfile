# backend/Dockerfile
FROM node:20-alpine

WORKDIR /server

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
