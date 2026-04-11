FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS production

WORKDIR /app

COPY package*.json ./
#COPY .env ./
COPY --from=build /app/dist ./dist

RUN npm ci --omit=dev

ENV NODE_ENV=production

EXPOSE 7000

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["npm", "run", "start:prod"]
