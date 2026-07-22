# syntax=docker/dockerfile:1

FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --no-audit --no-fund
COPY frontend/ ./
ENV REACT_APP_API_BASE_URL=/api
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app/backend
ENV NODE_ENV=production
ENV SERVE_CLIENT=true
ENV PORT=5000

RUN apk add --no-cache wget

COPY backend/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY backend/ ./
COPY --from=frontend-build /app/frontend/build /app/frontend/build

RUN mkdir -p uploads && chown -R node:node /app
USER node

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/api/health || exit 1

CMD ["node", "server.js"]
