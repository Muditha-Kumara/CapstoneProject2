# Backend Dockerfile for development (hot reload)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
#this getting issue with windows system
COPY .env .env   
EXPOSE 5000
CMD ["npm", "run", "dev"]
