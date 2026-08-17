import { useEffect, useState } from "react";

import {
  diagnosticsService,
} from "../services/DiagnosticsService";

export function EventLogPanel() {
  const [events, setEvents] =
    useState(
      diagnosticsService.getEvents()
    );

  useEffect(() => {
    const timer =
      setInterval(() => {
        setEvents(
          diagnosticsService.getEvents()
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  const exportLog = () => {
    const data =
      diagnosticsService.export();

    const blob =
      new Blob(
        [
          JSON.stringify(
            data,
            null,
            2
          ),
        ],
        {
          type:
            "application/json",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "photo-extension-diagnostics.json";

    link.click();
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: 10,
        }}
      >
        <h2>Event Log</h2>

        <button
          onClick={exportLog}
        >
          Export
        </button>
      </div>

      <div
        style={{
          maxHeight: 350,
          overflow: "auto",
        }}
      >
        {events.length === 0 && (
          <div>
            No events captured
          </div>
        )}

        {events.map(
          (event, index) => (
            <div
              key={index}
              style={{
                padding: 10,
                marginBottom: 10,
                border:
                  "1px solid #444",
                borderRadius: 4,
              }}
            >
              <div>
                <strong>
                  {event.event}
                </strong>
              </div>

              <div>
                {
                  event.category
                }
              </div>

              <div>
                {
                  event.timestamp
                }
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}