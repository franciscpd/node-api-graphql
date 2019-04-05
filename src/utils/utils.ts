import { Server } from 'http';
import { AddressInfo } from 'net';

export const normalizePort = (val: number | string): number => (typeof val === 'string' ? parseInt(val, 10) : val);

export const onError = (server: Server) => (error: NodeJS.ErrnoException): void => {
  const { port } = server.address() as AddressInfo;
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? `pipe ${port}` : `port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

export const onListening = (server: Server) => (): void => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `http://${addr.address}:${addr.port}`;
  console.log(`Listening at ${bind}...`);
};

export const handleError = (error: Error) => {
  const errorMessage: string = `${error.name}: ${error.message}`;
  const env: string = process.env.NODE_ENV;
  if (env !== 'test' && env !== 'pipelines') {
    console.log(errorMessage);
  }
  return Promise.reject(new Error(errorMessage));
};

export const throwError = (condition: boolean, message: string): void => {
  if (condition) {
    throw new Error(message);
  }
};

export const { JWT_SECRET } = process.env;
