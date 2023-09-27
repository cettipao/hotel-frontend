# Dockerfile para el servicio de React (Frontend)

# Imagen base para React
FROM node:latest

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos necesarios al contenedor
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos al contenedor
COPY . .

# Puerto en el que escucha el servidor de desarrollo de React
EXPOSE 3000

# Comando por defecto al ejecutar el contenedor
CMD ["npm", "start"]

