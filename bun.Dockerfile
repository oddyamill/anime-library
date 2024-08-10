# syntax=docker/dockerfile:1

ARG BUN_VERSION=1

FROM oven/bun:${BUN_VERSION}-alpine AS base

WORKDIR /usr/src/app

FROM base AS deps

RUN apk add --no-cache libstdc++

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  bun install --frozen-lockfile --production

FROM deps AS build

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM base AS final

ENV NODE_ENV=production

USER bun

COPY package.json .

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 27880

CMD bun run start:prod
