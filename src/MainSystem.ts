/**
 * Subsystems
 */

import { ASDS } from './subsystems/ASDS';
import { OCS } from './subsystems/OCS';
import { SES } from './subsystems/SES';
import { WSS } from './subsystems/WSS';

/**
 * Components
 */

import { ADC } from './components/ADC';
import { SDC } from './components/SDC';

export class MainSystem {
  /**
   * Overlays state centralization. Abstracted from where they come from (sockets, cli...).
   */
  private ocs: OCS = new OCS();

  /**
   * Manages the HTTP requests and responses.
   */
  private wss: WSS | undefined;

  /**
   * Manages the socket requests and connections.
   */
  private ses: SES | undefined;

  /**
   * Listens for new overlays and creates subscriptions for ad delivery.
   * It also delivers the ad to the different deliverable emplacements as Platform Chats
   * or anything else.
   */
  private asds: ASDS | undefined;

  /**
   * Groups logic by components. No persistence or infrastructure implementation.
   * Focusing on actor needs/use cases.
   */
  private components = {
    adc: new ADC(this.ocs),
    sdc: new SDC(this.ocs),
  };

  start(): void {
    this.wss = new WSS(this.ocs, this.components.sdc);
    console.info(`📦 OCS: Loaded.`);
    
    this.asds = new ASDS(this.ocs);
    console.info(`📦 ASDS: Loaded.`);

    this.wss.listen(3000, () => {
      if (!this.wss?.listening()) process.exit(1);
      console.log(`👂 WSS: Listening on port 3000.`)
      
      this.ses = new SES(this.wss.server, this.ocs);
      console.info(`📦 SES: Loaded.`);
  
      console.info('⚡ System has started.');
    });
  }
}
