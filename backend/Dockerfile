FROM node:18 as builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --production=false

# Copy code
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src
COPY package.json ./

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

FROM node:18-slim
WORKDIR /app

# Copy runtime artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY wait-for-db.sh ./wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh","-c","/app/wait-for-db.sh && npx prisma migrate deploy && npm start"]
