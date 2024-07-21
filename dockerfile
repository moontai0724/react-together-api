# image for building
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm run build

RUN pnpm prune --prod

# Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./migrations ./migrations
COPY kysely.config.ts ./kysely.config.ts

EXPOSE 3000

CMD ["npm", "start"]
