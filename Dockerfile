# Usar una imagen base de Node.js
FROM node:18 AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Construir la aplicación Next.js
# RUN npm run build

# Usar una imagen base para el entorno de producción
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar las dependencias de la etapa de construcción
COPY --from=builder /app ./

# Copiar el script de inicio
COPY start.sh ./

# Hacer que el script sea ejecutable
RUN chmod +x start.sh

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Iniciar la aplicación Next.js usando el script
CMD ["./start.sh"]

