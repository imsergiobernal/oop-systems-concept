import { OCS } from '../subsystems/OCS'

/**
 * Admin Domain Component
 */
export class ADC {
  private ocs: OCS;

  constructor(ocs: OCS) {
    this.ocs = ocs;
  }

  getConnectedOverlays(): number {
    return this.ocs.getRegistered();
  }
}
