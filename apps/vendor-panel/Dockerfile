# Base image
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.5.0

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/vendor-panel/package.json ./apps/vendor-panel/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS installer
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/vendor-panel/node_modules ./apps/vendor-panel/node_modules
COPY . .

WORKDIR /app/apps/vendor-panel
EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "dev"]

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/vendor-panel/node_modules ./apps/vendor-panel/node_modules
COPY . .

WORKDIR /app/apps/vendor-panel

# Build the application
RUN pnpm build

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 vite
RUN adduser --system --uid 1001 vite

COPY --from=builder --chown=vite:vite /app/apps/vendor-panel/dist ./dist

USER vite

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "preview"]