FROM oven/bun:1.1.42-slim AS base
WORKDIR /app
COPY . .

FROM base AS dev-deps
COPY ./package.json bun.lockb /app/
RUN bun i --frozen-lockfile

FROM base AS prod-deps
COPY ./package.json bun.lockb /app/
RUN bun i --production

FROM base AS builder
COPY ./package.json bun.lockb /app/
COPY --from=dev-deps /app/node_modules /app/node_modules
RUN bun run build

FROM base
COPY ./package.json bun.lockb server.js /app/
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build

CMD ["bun", "run", "start"]
