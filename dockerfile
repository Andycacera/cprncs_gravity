# --------- Etapa 1: Build ---------
FROM node:24-alpine AS base

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos de definición de dependencias
COPY package*.json ./

ENV NODE_ENV=production

# --------- Etapa 2: Dev ---------
FROM base AS dev
ENV NODE_ENV=development

# Instalamos TODAS las dependencias (incluye devDependencies)
RUN npm install
# Copiamos el resto del código del proyecto
COPY . .
# Construimos la app NestJS (genera la carpeta dist)
CMD ["npm", "run", "start:dev"]

# Stage de build (compilación)
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# --------- Etapa 3: Runtime (producción) ---------
FROM node:24-alpine AS prod

# Directorio de trabajo dentro del contenedor
WORKDIR /app

ENV NODE_ENV=production

# Copiamos sólo los archivos de dependencias
COPY package*.json ./

# Instalamos solo dependencias de producción (sin devDependencies)
RUN npm install --omit=dev && npm cache clean --force

# Copiamos los archivos compilados desde la etapa de build
COPY --from=build /app/dist ./dist
# Exponemos el puerto en el que corre Nest (por defecto 3000)
EXPOSE 3000

# Comando por defecto para arrancar la app
CMD ["node", "dist/main.js"]
