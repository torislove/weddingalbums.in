/**
 * server/events.js
 * Real-Time Event Bus for Server-Sent Events (SSE).
 * Enables instant synchronization across Studio, Creator, and Operations Portals.
 */
import { EventEmitter } from 'events';

class RealtimeEventBus extends EventEmitter {
  constructor() {
    super();
    this.clients = new Map();
    
    // Heartbeat every 25s to keep connections alive through reverse proxies
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, 25000);
    this.heartbeatTimer.unref();
  }

  addClient(id, res, user) {
    this.clients.set(id, {
      id,
      res,
      userId: user.id || user._id,
      role: user.role,
      connectedAt: Date.now()
    });

    // Send initial connected confirmation event
    this.sendEventToClient(res, 'connected', {
      clientId: id,
      userRole: user.role,
      activeConnections: this.clients.size,
      timestamp: new Date().toISOString()
    });
  }

  removeClient(id) {
    if (this.clients.has(id)) {
      this.clients.delete(id);
    }
  }

  sendHeartbeat() {
    for (const [id, client] of this.clients.entries()) {
      try {
        client.res.write(':keepalive\n\n');
      } catch (err) {
        this.removeClient(id);
      }
    }
  }

  sendEventToClient(res, eventName, data) {
    try {
      res.write(`event: ${eventName}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch {
      // Ignored, client will be cleaned up on close
    }
  }

  /**
   * Broadcast an event to matching clients
   * @param {string} eventName - e.g. 'task:created', 'task:claimed', 'order:updated'
   * @param {object} payload - event payload
   * @param {function} [filterFn] - optional filter (client) => boolean
   */
  broadcast(eventName, payload, filterFn = null) {
    const enrichedPayload = {
      ...payload,
      _timestamp: new Date().toISOString()
    };

    for (const [id, client] of this.clients.entries()) {
      if (!filterFn || filterFn(client)) {
        this.sendEventToClient(client.res, eventName, enrichedPayload);
      }
    }
  }

  getClientStats() {
    const roles = {};
    for (const client of this.clients.values()) {
      roles[client.role] = (roles[client.role] || 0) + 1;
    }
    return {
      total: this.clients.size,
      byRole: roles
    };
  }
}

export const eventBus = new RealtimeEventBus();
export default eventBus;
