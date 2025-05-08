FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:18 AS production
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3002
CMD ["node", "dist/main"]