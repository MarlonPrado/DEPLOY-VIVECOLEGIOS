import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { Ipware } from '@fullerstack/nax-ipware';
import FileUploadDataSource from '@profusion/apollo-federation-upload';
import Cors from 'cors';
import Express, { RequestHandler } from 'express';
import { expressjwt } from 'express-jwt';
import * as fs from 'fs';
import geoip from 'geoip-lite';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import http from 'http';
import https from 'https';
import Morgan from 'morgan';
import path from 'path';
import { env } from 'process';

import {
  GATEWAY_HTTP_PORT_APP,
  GATEWAY_HTTPS_PORT_APP,
  SERVER_NAME_APP,
  SERVER_PORT_APP,
} from './config';

import 'reflect-metadata';

const cluster = require('node:cluster');
const expressHealthApi = require('express-health-api');
//const numCPUs = env.NODE_ENV === "development" ? 1 : require('node:os').cpus().length;
const numCPUs = env.NODE_ENV === 'development' ? 1 : 1;
const jwt = require('jsonwebtoken');
var httpsOptions = {
  // this is the private key only
  key: fs.readFileSync(path.join('ssl', 'vivecolegios', 'private.key')),
  // this must be the fullchain (cert + intermediates)
  cert: fs.readFileSync(path.join('ssl', 'vivecolegios', 'certificate.crt')),
  // this stuff is generally only for peer certificates
  ca: fs.readFileSync(path.join('ssl', 'vivecolegios', 'ca_bundle.crt')),
  requestCert: false,
};

async function app() {
  try {
    const gateway = new ApolloGateway({
      supergraphSdl: new IntrospectAndCompose({
        subgraphs: [{ name: 'servers', url: 'http://localhost:4001/graphql' }],
      }),
      buildService({ url }: any) {
        return new FileUploadDataSource({
          url,
          willSendRequest({ request, context }: any) {
            let user = null;
            if (context?.token?.length > 0) {
              //console.log(context?.token?.replace('Bearer ', ''));
              user = jwt.decode(context?.token?.replace('Bearer ', ''));
            }
            request.http.headers.set('user', user ? JSON.stringify(user) : null);
            let requestdata = { ...context, user: user };
            //console.log(requestdata);
            request.http.headers.set('requestdata', requestdata);
            //console.log(context, user);
          },
        });
      },
    });

    const configExpressStatusMonitor = {
      title: 'Express Status ViveColegios', // Default title
      theme: 'default.css', // Default styles
      path: '/status',
      spans: [
        {
          interval: 1, // Every second
          retention: 60, // Keep 60 datapoints in memory
        },
        {
          interval: 5, // Every 5 seconds
          retention: 60,
        },
        {
          interval: 15, // Every 15 seconds
          retention: 60,
        },
      ],
      chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        eventLoop: true,
        heap: true,
        responseTime: true,
        rps: true,
        statusCodes: true,
      },
      healthChecks: [
        {
          protocol: 'http',
          host: 'localhost',
          path: `/healthcheck-${SERVER_NAME_APP}`,
          port: `${SERVER_PORT_APP}`,
        },
      ],
    };
    const ipware = new Ipware();
    const app = Express();
    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(httpsOptions, app);

    const server = new ApolloServer({
      gateway,
      includeStacktraceInErrorResponses: true,
      introspection: true,
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
        ApolloServerPluginDrainHttpServer({ httpServer }),
      ],
      formatError: (err: any) => {
        console.error('GraphQL Error', err);
        const errorReport = {
          message: err.message,
          locations: err.locations,
          path: err.path,
          stacktrace: err.extensions?.exception?.stacktrace || [],
          code: err.extensions?.code,
        };
        console.error('GraphQL Error', errorReport);
        if (errorReport.code == 'INTERNAL_SERVER_ERROR') {
          return {
            message: 'Oops! Something went wrong! :(',
            code: errorReport.code,
          };
        }
        return errorReport;
      },
    });

    await server.start();

    // Middlewares
    app.use(require('express-status-monitor')(configExpressStatusMonitor));
    app.use(Morgan('common'));
    // app.use(Helmet({
    //   contentSecurityPolicy: false,
    // }));
    app.use(Cors());
    app.use(expressHealthApi({ apiPath: '/health' }));
    app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));

    app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
    app.use('/public', Express.static(path.join(__dirname, '../public')));
    app.use(Express.json());
    app.use(
      expressjwt({
        secret: 'f1BtnWgD3VKY',
        algorithms: ['HS256'],
        credentialsRequired: false,
      }),
    );
    app.use(function (req, res, next) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      next();
    });
    app.use(
      expressMiddleware(server, {
        context: async ({ req, res }) => ({
          headers: req.headers,
          token: req.headers['authorization'],
          ip: JSON.stringify(req.ip),
          geo: geoip.lookup(req?.ip ? req?.ip : ''),
          browser: req.headers['user-agent'],
          language: req.headers['accept-language'],
          ipware: ipware.getClientIP(req),
          ipwarePublic: ipware.getClientIP(req, { publicOnly: true }),
        }),
      }) as RequestHandler,
    );

    await new Promise((resolve) => {
      httpServer.listen({ port: GATEWAY_HTTP_PORT_APP }, () => {
        console.log(
          `🚀 Server ready and listening at ==> http://vivecolegios.nortedesantander.gov.co:${GATEWAY_HTTP_PORT_APP}`,
        );
        console.log(`Worker ${process.pid} started`);
      });
      httpsServer.listen({ port: GATEWAY_HTTPS_PORT_APP }, () => {
        console.log(
          `🚀 Server ready and listening at ==> https://vivecolegios.nortedesantander.gov.co:${GATEWAY_HTTPS_PORT_APP}`,
        );
        console.log(`Worker ${process.pid} started`);
      });
    });
  } catch (err) {
    console.error(err);
  }
}

if (cluster.isMaster) {
  console.log(`Master Gateway ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  // This event is firs when worker died
  cluster.on('exit', (worker: { process: { pid: any } }, code: any, signal: any) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}
// For Worker
else {
  app();
}
