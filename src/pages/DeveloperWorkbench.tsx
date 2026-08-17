import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

import {
  CapabilityScanner,
} from "../services/CapabilityScanner";

import { EventLogPanel }
  from "../components/EventLogPanel";

import { ApiExplorer }
  from "../components/ApiExplorer";

export function DeveloperWorkbench() {
  const [report, setReport] =
    useState<any>();

  const [connectionStatus,
    setConnectionStatus] =
    useState(
      "Not Connected"
    );

  const connectWorkspace =
    async () => {
      try {
        const api =
          await workspaceService
            .connect();

        const capabilityReport =
          CapabilityScanner.scan(
            api
          );

        setReport(
          capabilityReport
        );

        setConnectionStatus(
          "Connected"
        );
      }
      catch {
        setConnectionStatus(
          "Connection Failed"
        );
      }
    };

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <h1>
        Developer Workbench
      </h1>

      <button
        onClick={
          connectWorkspace
        }
      >
        Connect Workspace
      </button>

      <p>
        Status:
        {" "}
        {connectionStatus}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 20,
        }}
      >
        <div
          style={{
            border:
              "1px solid #444",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <h2>
            Capability Report
          </h2>

          <pre>
            {JSON.stringify(
              report,
              null,
              2
            )}
          </pre>
        </div>

        <div
          style={{
            border:
              "1px solid #444",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <EventLogPanel />
        </div>

        <div
          style={{
            gridColumn:
              "span 2",
            border:
              "1px solid #444",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <ApiExplorer />
        </div>
      </div>
    </div>
  );
}