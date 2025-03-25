FROM node:22-slim AS base
WORKDIR /app

FROM base AS dev-deps
COPY . /app
RUN npm ci

FROM base AS prod-deps
COPY ./package.json package-lock.json /app/
RUN npm ci --omit=dev

FROM base AS builder
COPY . /app/
COPY --from=dev-deps /app/node_modules /app/node_modules
RUN npm run build

FROM base
COPY ./database/migrations/ /app/database/migrations/
COPY ./package.json package-lock.json server.js migrate.js /app/
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build
CMD ["npm", "run", "start"]
