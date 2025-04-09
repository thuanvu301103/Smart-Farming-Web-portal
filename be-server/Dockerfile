FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:18 as production
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3000
CMD ["node", "dist/main"]