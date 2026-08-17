import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function MarkerLab() {
  const [status, setStatus] =
    useState("Ready");

  const inspectViewer =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        console.log(
          "=== API ==="
        );

        console.log(api);

        console.log(
          "=== VIEWER ==="
        );

        console.log(api.viewer);

        console.log(
          "=== VIEWER KEYS ==="
        );

        console.log(
          Object.keys(api.viewer)
        );

        setStatus(
          "Viewer dumped to console"
        );
      }
      catch (error: any) {
        console.error(error);

        setStatus(
          error?.message ??
          "Unknown error"
        );
      }
    };

  const getModels =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const models =
          await api.viewer.getModels();

        console.log(
          "=== MODELS ==="
        );

        console.log(models);

        setStatus(
          "Models dumped to console"
        );
      }
      catch (error: any) {
        console.error(
          "=== MODELS ERROR ==="
        );

        console.error(error);

        setStatus(
          error?.message ??
          "Unknown error"
        );
      }
    };

  return (
    <div>
      <h2>Marker Lab</h2>

      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <button
          onClick={
            inspectViewer
          }
        >
          Inspect Viewer
        </button>

        <button
          onClick={getModels}
        >
          Get Models
        </button>
      </div>

      <pre>
        {status}
      </pre>
    </div>
  );
}