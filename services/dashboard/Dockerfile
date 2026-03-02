FROM node:20
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
EXPOSE 8080
CMD ["npx", "next", "dev", "-p", "8080", "-H", "0.0.0.0"]
