# Builder
FROM node:22.20-alpine AS builder

WORKDIR /app

# Needed for Prisma + MySQL client
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

COPY .env .env

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build



# Runtime
FROM node:22.20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# copy only production files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
