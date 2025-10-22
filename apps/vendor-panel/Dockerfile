# Multi-stage build for Vite Vendor Panel
FROM node:22-alpine AS base
RUN npm install -g pnpm@9.5.0

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/vendor-panel/package.json ./apps/vendor-panel/package.json
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the vendor panel
RUN pnpm --filter vendor-panel build

FROM nginx:alpine AS runner
# Copy built files to nginx
COPY --from=builder /app/apps/vendor-panel/dist /usr/share/nginx/html

# Copy nginx config
COPY apps/vendor-panel/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]