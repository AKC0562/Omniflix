# ===== SERVER =====
FROM node:20-alpine AS server-deps
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --production

FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# ===== CLIENT =====
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --legacy-peer-deps
COPY client/ ./
RUN npm run build

# ===== PRODUCTION =====
FROM node:20-alpine AS production
WORKDIR /app

# Copy server
COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY --from=server-build /app/server/dist ./server/dist
COPY server/package.json ./server/

# Copy client build
COPY --from=client-build /app/client/dist ./client/dist

# Expose port
EXPOSE 5000

# Environment
ENV NODE_ENV=production

# Start server
CMD ["node", "server/dist/index.js"]
