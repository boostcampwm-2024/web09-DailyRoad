FROM node:20-alpine AS builder

RUN apk update

WORKDIR /build

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20-alpine

WORKDIR /app

RUN apk update

COPY --from=builder /build/.env.prod .env
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json .

CMD ["node", "dist/main.js"]
