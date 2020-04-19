import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';

import { OCS } from './OCS';
import { SDC } from '../components/SDC';

/**
 * Web Service Subsystem
 */
export class WSS {
  private app: express.Application;

  private admin: express.Router = express.Router();

  private streamer: express.Router = express.Router();

  public server: http.Server;

  private ocs: OCS;

  private sdc: SDC;

  constructor(ocs: OCS, sdc: SDC) {
    this.ocs = ocs;
    this.sdc = sdc;
    this.app = express();
    this.app.use(bodyParser.json());
    this.loadRoutes();
    this.server = http.createServer(this.app);
  }

  private loadRoutes(): void {
    this.app.get('/', (req, res) => {
      return res.sendStatus(200);
    });

    this.app.post('/signup', async (req, res) => {
      try {
        await this.sdc.signup(req.body.email, req.body.nickname, req.body.password);
        return res.sendStatus(201);
      } catch (err) {
        return res.status(500).send(err);
      }
    })
  
    this.app.post('/overlay', async (req, res) => {
      try {
        await this.sdc.createOverlay('consolelog', 'srgy', {
          onsend: async (content) => console.info(`Received:`, content),
          ondisconnect: async (id) => console.info(`Disconnection request for overlay id ${id}`)
        });
        return res.sendStatus(201);
      } catch (err) {
        return res.status(500).send(err);
      }
    })
  
    this.app.use(this.admin, this.streamer);
  }

  public listen(port: number, cb: () => void): void {
    this.server.listen(port, cb);
  }

  public listening(): boolean {
    return this.server.listening;
  }
}
