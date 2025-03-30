# Etapa de dependencias
FROM node:21-alpine AS deps
WORKDIR /app

RUN apk add --no-cache python3 make g++
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Etapa de construcción
FROM deps AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar cliente Prisma
RUN pnpx prisma generate

# Construir la aplicación
RUN pnpm run build

# Etapa de producción
FROM node:21-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl
RUN npm install -g pnpm

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Exponer puerto de la aplicación
EXPOSE 3000

# Copiar el script de inicio
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]