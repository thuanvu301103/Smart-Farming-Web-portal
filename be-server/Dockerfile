FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main"]