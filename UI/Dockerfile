FROM node:20

WORKDIR /app/frontend

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]

EXPOSE 5173