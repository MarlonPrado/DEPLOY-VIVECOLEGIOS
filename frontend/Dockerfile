# Usa una imagen oficial de Node
FROM node:18.20.4

# Crea una carpeta dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto
COPY package.json yarn.lock ./
COPY . .

# Instala dependencias
RUN yarn install

# Expone el puerto que usa 
EXPOSE 3000

# Comando para iniciar 
CMD ["yarn", "run", "run:dev"]
