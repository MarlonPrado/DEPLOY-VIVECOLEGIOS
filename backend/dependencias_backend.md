# Documentación de Dependencias del Backend

## Dependencias

| Nombre                      | Versión  | Descripción                                                                                   |
|-----------------------------|----------|-----------------------------------------------------------------------------------------------|
| @apollo/gateway             | 2.8.3    | Implementación de gateway para Apollo Federation, permite combinar múltiples servicios GraphQL.|
| @apollo/server              | 4.10.4   | Servidor GraphQL de Apollo para construir APIs GraphQL.                                       |
| @apollo/subgraph            | 2.8.3    | Biblioteca para construir subgraphos en Apollo Federation.                                   |
| @fullerstack/nax-ipware     | 0.10.0   | Middleware para obtener la IP del cliente en aplicaciones Node.js.                            |
| @profusion/apollo-federation-upload | 4.2.0 | Extensión para manejar uploads en Apollo Federation.                                         |
| @types/dotenv              | 8.2.0    | Tipos TypeScript para dotenv, que carga variables de entorno.                                |
| @types/express             | 4.17.21  | Tipos TypeScript para Express.js, framework web para Node.js.                                |
| @types/express-jwt         | 7.4.2    | Tipos TypeScript para express-jwt, middleware para autenticación JWT en Express.             |
| @types/geoip-lite          | 1.4.2    | Tipos TypeScript para geoip-lite, librería para geolocalización IP.                          |
| @types/helmet              | 4.0.0    | Tipos TypeScript para helmet, middleware de seguridad para Express.                          |
| @types/jsonwebtoken        | 9.0.6    | Tipos TypeScript para jsonwebtoken, para manejo de tokens JWT.                              |
| @types/mongodb             | 4.0.7    | Tipos TypeScript para MongoDB driver oficial.                                               |
| @types/morgan              | 1.9.9    | Tipos TypeScript para morgan, middleware de logging HTTP.                                  |
| @types/node                | 20.11.7  | Tipos TypeScript para Node.js.                                                              |
| bcrypt                     | 5.1.1    | Librería para hashing de contraseñas con bcrypt.                                            |
| class-validator            | 0.14.1   | Librería para validación de clases y objetos en TypeScript y JavaScript.                    |
| cluster                    | 0.7.7    | Módulo para crear procesos hijos en Node.js para aprovechar múltiples núcleos CPU.         |
| concurrently               | 8.2.2    | Ejecuta múltiples comandos en paralelo en la terminal.                                     |
| cors                       | 2.8.5    | Middleware para habilitar CORS (Cross-Origin Resource Sharing) en Express.                  |
| dotenv                     | 16.4.5   | Carga variables de entorno desde un archivo .env.                                          |
| easy-pdf-merge             | 0.2.6    | Librería para combinar múltiples archivos PDF en uno solo.                                 |
| ember-truth-helpers        | 4.0.3    | Helpers para Ember.js (posiblemente no usado en backend).                                  |
| express                    | 4.19.2   | Framework web para Node.js para construir APIs y aplicaciones web.                         |
| express-health-api         | 0.2.2    | Middleware para endpoints de salud en aplicaciones Express.                                |
| express-healthcheck        | 0.1.0    | Middleware para chequeo de salud simple en Express.                                        |
| express-jwt                | 8.4.1    | Middleware para autenticación JWT en Express.                                              |
| express-status-monitor     | 1.3.4    | Middleware para monitoreo de estado de aplicaciones Express.                               |
| fs-extra                   | 11.2.0   | Extensiones para el módulo fs de Node.js con funciones adicionales.                        |
| geoip-lite                 | 1.4.7    | Librería para geolocalización IP rápida y ligera.                                         |
| graphql                    | 16.9.0   | Implementación de referencia de GraphQL para JavaScript.                                  |
| graphql-import-files       | 1.3.0    | Permite importar archivos GraphQL en otros archivos GraphQL.                              |
| graphql-middleware         | 6.1.35   | Middleware para GraphQL para agregar lógica antes o después de resolvers.                 |
| graphql-relay              | 0.10.1   | Implementación de especificación Relay para GraphQL.                                     |
| graphql-request            | 6.1.0    | Cliente ligero para hacer peticiones GraphQL.                                            |
| graphql-scalars            | 1.23.0   | Conjunto de scalars personalizados para GraphQL.                                        |
| graphql-shield             | 7.6.5    | Middleware para autorización en GraphQL.                                                |
| graphql-tag                | 2.12.6   | Permite parsear queries GraphQL en JavaScript.                                          |
| graphql-tools              | 8.3.20   | Herramientas para construir esquemas GraphQL.                                          |
| graphql-upload-minimal     | ^1.6.1   | Middleware para manejar uploads en GraphQL.                                           |
| graphql-voyager            | 2.0.0    | Visualizador interactivo de esquemas GraphQL.                                        |
| handlebars                 | 4.7.8    | Motor de plantillas para JavaScript.                                                  |
| handlebars-helper-svg      | 2.0.2    | Helper para manejar SVGs en Handlebars.                                              |
| helmet                     | 7.1.0    | Middleware para seguridad HTTP en Express.                                          |
| jsonwebtoken               | 9.0.2    | Implementación de JSON Web Tokens para autenticación.                              |
| moment                     | 2.30.1   | Librería para manejo y manipulación de fechas y horas.                            |
| mongodb                    | 4.10.0   | Driver oficial de MongoDB para Node.js.                                           |
| mongodb-snapshot           | 1.4.1    | Herramienta para crear snapshots de bases de datos MongoDB.                      |
| morgan                     | 1.10.0   | Middleware para logging HTTP en Express.                                         |
| node-gyp                   | 10.1.0   | Herramienta para compilar addons nativos de Node.js.                            |
| passport                   | 0.7.0    | Middleware para autenticación en Node.js.                                        |
| passport-http              | 0.3.0    | Estrategia HTTP básica para Passport.                                           |
| passport-jwt               | 4.0.1    | Estrategia JWT para Passport.                                                  |
| pdf-merger-js              | 4.3.0    | Librería para combinar archivos PDF en JavaScript.                            |
| puppeteer                  | 22.13.1  | Librería para controlar Chrome o Chromium de forma programada.                |
| puppeteer-report           | 3.1.0    | Herramienta para generar reportes PDF con Puppeteer.                         |
| reflect-metadata           | 0.2.2    | Polyfill para metadata reflection en TypeScript.                            |
| rxjs                       | ^7.8.1   | Librería para programación reactiva usando Observables.                    |
| short-unique-id            | 4.4.4    | Generador de IDs únicos cortos.                                              |
| ts-node                    | 10.9.2   | Ejecuta archivos TypeScript directamente sin compilación previa.            |
| type-graphql               | 2.0.0-rc.2 | Framework para construir APIs GraphQL con TypeScript usando decoradores. |
| typedi                     | 0.10.0   | Contenedor de inyección de dependencias para TypeScript y JavaScript.       |
| typeorm                    | 0.3.10   | ORM para TypeScript y JavaScript que soporta múltiples bases de datos.      |
| typeorm-typedi-extensions  | 0.4.1    | Extensiones para integrar TypeORM con Typedi.                              |
| typescript                 | 5.5.3    | Lenguaje de programación que añade tipado estático a JavaScript.          |
| wait-on                    | 7.2.0    | Herramienta para esperar a que recursos estén disponibles (puertos, archivos).|

## DevDependencies

| Nombre                    | Versión  | Descripción                                                                                   |
|---------------------------|----------|-----------------------------------------------------------------------------------------------|
| @types/bcrypt             | 5.0.2    | Tipos TypeScript para bcrypt.                                                                 |
| @types/cors               | 2.8.17   | Tipos TypeScript para cors.                                                                   |
| @types/lodash.merge       | 4.6.9    | Tipos TypeScript para lodash.merge.                                                           |
| chalk                     | 5.3.0    | Librería para colorear texto en la terminal.                                                  |
| eslint                    | 8.56.0   | Herramienta para análisis estático de código JavaScript y TypeScript.                         |
| eslint-config-prettier    | 9.1.0    | Configuración para desactivar reglas de eslint que entran en conflicto con prettier.          |
| eslint-plugin-prettier    | 5.1.3    | Plugin para integrar prettier con eslint.                                                     |
| husky                     | 9.0.11   | Herramienta para gestionar hooks de Git.                                                     |
| lint-staged               | 15.2.7   | Ejecuta linters en archivos staged en Git.                                                   |
| mocha                     | 10.4.0   | Framework para pruebas en JavaScript.                                                        |
| nodemon                   | 3.1.4    | Herramienta para reiniciar automáticamente el servidor Node.js al detectar cambios.          |
| nyc                       | 15.1.0   | Herramienta para medir cobertura de pruebas.                                                 |
| prettier                  | 3.2.5    | Formateador de código.                                                                       |
| proxyquire                | 2.1.3    | Permite mockear dependencias en pruebas unitarias.                                          |
| sinon                     | 17.0.1   | Librería para mocks, spies y stubs en pruebas.                                              |
| sonar-scanner             | 3.1.0    | Herramienta para análisis estático de código con SonarQube.                                 |
| supertest                 | 6.3.4    | Librería para pruebas HTTP en Node.js.                                                      |

Si desea, puedo entregarlo en otro formato o ayudar con algo más.
