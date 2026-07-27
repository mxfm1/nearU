# ================================================
# Stage 1: Install dependencies
# ================================================
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# ================================================
# Stage 2: Build
# ================================================
FROM deps AS builder
WORKDIR /app

# Copy all source code
COPY . .

# Build the Next.js application
RUN pnpm build

# ================================================
# Stage 3: Runtime runner
# ================================================
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Next.js build output (no standalone, so we need .next and node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["next", "start"]
