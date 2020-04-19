import http from 'http';
import io from 'socket.io';
import { OCS } from './OCS';

/**
 * Socket Engine Subsystem
 */
export class SES {
  private server: io.Server;

  constructor(
    server: http.Server,
    ocs: OCS
  ) {
    this.server = io(server);
    this.server.use(function authParser(socket, err) {
      /**
       * JWT
       */
      socket.request.user = {
        id: 'ab34c-23y2',
        email: 'sergioguillot@gmail.com',
        nickname: 'srgy'
      };
    });
    this.server.on('connection', socket => {
      ocs.registerOverlay(socket.request.user.nickname, socket.id,
        {
          adapter: {
            async onsend(content): Promise<void> {
              socket.send(content);
            },
            async ondisconnect(): Promise<void> {
              socket.disconnect();
            }
          },
        }
      );
  
      socket.disconnect();
    });
  }

  public getClients() {
    return this.server.clients;
  }
}
