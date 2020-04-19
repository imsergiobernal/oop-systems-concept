import { EventEmitter } from 'events';

export interface Adapter {
  onsend(content: unknown): Promise<void>;
  ondisconnect(id: string): Promise<void>;
}

class Overlay {
  public id: string;
  public adapter: Adapter;

  constructor(id: string, adapter: Adapter) {
    this.id = id;
    this.adapter = adapter;
  }

  public send(content: unknown): void {
    this.adapter.onsend(content);
  }
}

/**
 * Overlays Container Subsystem
 */
export class OCS {
  private index: { [id: string]: string } = {};

  private events = new EventEmitter();

  private overlaysPool: { [uri: string]: Set<Overlay> };

  constructor() {
    this.overlaysPool = {};
  }

  private updateIndex(id: string, uri?: string): void {
    if (this.index[id] || !uri) { delete this.index[id]; return; }
    if (uri) { this.index[id] = uri; return; }
  }

  removeOverlay(id: string): void {
    const uri = this.index[id];
    const overlay = Array.from(this.overlaysPool[uri].values()).find(overlay => overlay.id === id);
    if (!overlay) return;
    this.overlaysPool[uri].delete(overlay);
    this.updateIndex(id);
  }

  registerOverlay(uri: string, id: string, opts: { adapter: Adapter }): void {
    if (!this.overlaysPool[uri]) this.overlaysPool[uri] = new Set();

    const overlay = new Overlay(id, opts.adapter);
    this.overlaysPool[uri].add(overlay);
    this.updateIndex(id, uri);
  
    this.events.emit('overlay registered', { overlay, uri });
  }

  getRegistered(): number {
    return Number(this.index.length);
  }

  sendTo(uri: string, body: unknown): void {
    this.overlaysPool[uri].forEach(overlay => overlay.send(body));
  }

  onOverlayRegistered(cb: (event: { overlay: Overlay; uri: string }) => void): void {
    this.events.on('overlay registered', cb);
  }
}
