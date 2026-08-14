import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

import {
  CapabilityScanner,
} from "../services/CapabilityScanner";

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

      <div
        style={{
          marginBottom: 20,
        }}
      >
        <button
          onClick={
            connectWorkspace
          }
        >
          Connect Workspace
        </button>
      </div>

      <div
        style={{
          marginBottom: 20,
        }}
      >
        <strong>
          Status:
        </strong>
        {" "}
        {connectionStatus}
      </div>

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
          <h2>
            Event Log
          </h2>

          <p>
            Coming Soon
          </p>
        </div>

        <div
          style={{
            border:
              "1px solid #444",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <h2>
            API Explorer
          </h2>

          <p>
            Coming Soon
          </p>
        </div>

        <div
          style={{
            border:
              "1px solid #444",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <h2>
            Marker Lab
          </h2>

          <p>
            Coming Soon
          </p>
        </div>
      </div>
    </div>
  );
}