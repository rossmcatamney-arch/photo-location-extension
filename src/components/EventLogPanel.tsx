import { useState } from "react";

import {
  diagnosticsService,
} from "../services/DiagnosticsService";

export function EventLogPanel() {
  const [events] = useState(
    diagnosticsService.getEvents()
  );

  return (
    <div>
      <h2>Event Log</h2>

      <div
        style={{
          maxHeight: 300,
          overflow: "auto",
        }}
      >
        {events.map(
          (event, index) => (
            <div
              key={index}
              style={{
                marginBottom: 10,
                padding: 10,
                border:
                  "1px solid #333",
              }}
            >
              <strong>
                {event.event}
              </strong>

              <div>
                {
                  event.timestamp
                }
              </div>

              <small>
                {
                  event.category
                }
              </small>
            </div>
          )
        )}
      </div>
    </div>
  );
}