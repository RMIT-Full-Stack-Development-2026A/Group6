import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
export declare const initSocket: (httpServer: HttpServer) => SocketIOServer;
export declare const getIO: () => SocketIOServer;
