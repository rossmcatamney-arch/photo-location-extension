export interface DiagnosticEvent {
  timestamp: string;

  category: string;

  event: string;

  payload?: unknown;
}

class DiagnosticsService {
  private events:
    DiagnosticEvent[] = [];

  add(
    category: string,
    event: string,
    payload?: unknown
  ) {
    this.events.unshift({
      timestamp:
        new Date().toISOString(),

      category,

      event,

      payload,
    });

    this.events =
      this.events.slice(0, 200);
  }

  getEvents() {
    return this.events;
  }

  clear() {
    this.events = [];
  }
}

export const diagnosticsService =
  new DiagnosticsService();