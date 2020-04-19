import Agenda from 'agenda';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { OCS } from './OCS';

let mongodbConnectionString: string;

/**
 * Wouldn't exist in production code. Instead there would be an ORM / DAO.
 */
(async function createMongoMemoryDatabase(): Promise<void> {
  const mongodb = new MongoMemoryServer();
  await mongodb.start();
  await mongodb.ensureInstance();
  mongodbConnectionString = await mongodb.getConnectionString();
})

/**
 * Ad Subscription and Delivery Subsystem
 */
export class ASDS {
  private ocs: OCS;

  private subscriptions: Agenda = new Agenda(({ db: { address: mongodbConnectionString } }));

  constructor(ocs: OCS) {
    (async (): Promise<void> => {
      this.subscriptions = new Agenda({ db: { address: mongodbConnectionString } });
      
      this.subscriptions.define<{ streamerId: string }>('ad subscription', (job) => {
        this.ocs.sendTo(job.attrs.data.streamerId, { ad: { imageUrl: 'image.png' }})
        console.info('Sending Ad to Twitch Chat ...');
        console.info('Sending Ad to YouTube Chat ...');
      });
      
      await this.subscriptions.start();
    })();

    this.ocs = ocs;
    
    this.ocs.onOverlayRegistered(async (event) => await this.subscribe(event.uri));
  }

  async subscribe(streamerId: string): Promise<void> {
    const job = this.subscriptions.create('ad subscription', { streamerId });
    job.repeatEvery('5 seconds');
    await job.save();
  }
}
