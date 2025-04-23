import * as dotenv from 'dotenv';

console.log('Inicializando configuración de entorno...');
dotenv.config();

let path;
switch (process.env.NODE_ENV) {
  case 'test':
    path = `${__dirname}/../../.env`;
    console.log(`Modo TEST detectado, usando archivo .env en: ${path}`);
    break;
  case 'production':
    path = `${__dirname}/../../.env`;
    console.log(`Modo PRODUCCIÓN detectado, usando archivo .env en: ${path}`);
    break;
  default:
    path = `${__dirname}/../../.env`;
    console.log(`Modo DESARROLLO detectado (o no especificado), usando archivo .env en: ${path}`);
}

dotenv.config({ path: path });
console.log('Configuración de entorno cargada desde:', path);

// Exportando variables con logs
export const dev = process.env.NODE_ENV !== 'production';
console.log(`Modo desarrollo activado?: ${dev}`);

export const port = process.env.PORT || 4000;
console.log(`Puerto configurado: ${port}`);

export const cors = process.env.CORS;
console.log(`Configuración CORS: ${cors || 'No especificada'}`);

export const dbUser = process.env.DB_USER || 'db_user_vivecolegios';
console.log(`Usuario de DB: ${dbUser}`);

export const dbPassword = process.env.DB_PASSWORD || 'db_user_vivecolegios2021';
console.log(`Contraseña de DB: ${dbPassword.replace(/./g, '*')}`); // Ocultamos la contraseña real

export const dbHost = process.env.DB_HOST || 'cluster0.lsyav.mongodb.net';
console.log(`Host de DB: ${dbHost}`);

export const dbName = process.env.DB_NAME || 'app_db_vivecolegios';
console.log(`Nombre de DB: ${dbName}`);

export const dbPort = 27017;
console.log(`Puerto de DB: ${dbPort}`);

export const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
console.log(`Contraseña admin por defecto: ${defaultAdminPassword ? 'Configurada' : 'No configurada'}`);

export const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD;
console.log(`Contraseña usuario por defecto: ${defaultUserPassword ? 'Configurada' : 'No configurada'}`);

export const authJwtSecret = process.env.AUTH_JWT_SECRET;
console.log(`Secreto JWT: ${authJwtSecret ? 'Configurado' : 'NO CONFIGURADO - CRÍTICO'}`);

export const publicApiKeyToke = process.env.PUBLIC_API_KEY_TOKEN;
console.log(`Token API pública: ${publicApiKeyToke ? 'Configurado' : 'No configurado'}`);

export const adminApiKeyToken = process.env.ADMIN_API_KEY_TOKEN;
console.log(`Token API admin: ${adminApiKeyToken ? 'Configurado' : 'No configurado'}`);

export const SERVER_PORT_APP = 4001;
console.log(`Puerto del servidor interno: ${SERVER_PORT_APP}`);

export const GATEWAY_HTTP_PORT_APP = 4000;
console.log(`Puerto HTTP gateway: ${GATEWAY_HTTP_PORT_APP}`);

export const GATEWAY_HTTPS_PORT_APP = 4100;
console.log(`Puerto HTTPS gateway: ${GATEWAY_HTTPS_PORT_APP}`);

export const SERVER_NAME_APP = 'Vive Colegios 3.0';
console.log(`Nombre de la aplicación: ${SERVER_NAME_APP}`);

console.log('Configuración de entorno cargada completamente');