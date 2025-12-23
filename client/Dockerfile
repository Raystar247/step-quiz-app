FROM node:20-bookworm AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
# Use legacy peer deps to avoid ERESOLVE failures in builder environment
RUN npm ci --legacy-peer-deps

# Copy sources and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
