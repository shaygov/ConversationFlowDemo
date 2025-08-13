# chat-frontend/Dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3001
CMD ["npm", "run", "start-react"]