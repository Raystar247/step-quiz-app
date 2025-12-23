FROM node:20-bookworm AS builder
WORKDIR /usr/src/app

# Install production+dev dependencies for build
COPY package*.json ./
# Use legacy peer deps to reduce chance of resolver failures during image build
RUN npm ci --legacy-peer-deps

# Copy prisma and sources then generate client + build
COPY prisma ./prisma
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:20-bookworm AS runtime
WORKDIR /usr/src/app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files and prisma schema
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm","start"]
