import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

import {
  CapabilityScanner,
} from "../services/CapabilityScanner";

import {
  EnvironmentService,
} from "../services/EnvironmentService";

import { EventLogPanel }
  from "../components/EventLogPanel";

import { ApiExplorer }
  from "../components/ApiExplorer";

import { WorkspaceInspector }
  from "../components/WorkspaceInspector";

import { SystemInformationPanel }
  from "../components/SystemInformationPanel";

import { DiagnosticsExportPanel }
  from "../components/DiagnosticsExportPanel";

import { MarkerLab }
  from "../components/MarkerLab";

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
      catch (error) {
        console.error(error);

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
          padding: 10,
          border:
            "1px solid #444",
          borderRadius: 8,
        }}
      >
        <p>
          <strong>
            Environment:
          </strong>{" "}
          {
            EnvironmentService.getEnvironmentName()
          }
        </p>

        <p>
          <strong>
            Workspace:
          </strong>{" "}
          {connectionStatus}
        </p>
      </div>

      <button
        onClick={
          connectWorkspace
        }
      >
        Connect Workspace
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 20,
          marginTop: 20,
        }}
      >
        <div
          style={{
            border:
              "1px solid #444",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <SystemInformationPanel />
        </div>

        <div
          style={{
            border:
              "1px solid #444",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <DiagnosticsExportPanel />
        </div>

        <div
          style={{
            border:
              "1px solid #444",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <h2>
            Capability Report
          </h2>

          <pre
            style={{
              maxHeight: 400,
              overflow: "auto",
            }}
          >
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
            padding: 20,
            borderRadius: 8,
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
            padding: 20,
            borderRadius: 8,
          }}
        >
          <WorkspaceInspector />
        </div>

        <div
          style={{
            gridColumn:
              "span 2",
            border:
              "1px solid #444",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <ApiExplorer />
        </div>

        <div
          style={{
            gridColumn:
              "span 2",
            border:
              "1px solid #444",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <MarkerLab />
        </div>
      </div>
    </div>
  );
}