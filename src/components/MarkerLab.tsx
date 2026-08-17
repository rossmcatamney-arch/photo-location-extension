import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function MarkerLab() {
  const [status, setStatus] =
    useState("Ready");

  const getCamera =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        console.log(
          "=== VIEWER OBJECT ==="
        );

        console.log(api.viewer);

        const camera =
          await api.viewer.getCamera();

        console.log(
          "=== CAMERA ==="
        );

        console.log(camera);

        setStatus(
          "Camera dumped to console"
        );
      }
      catch (error: any) {
        console.error(
          "=== CAMERA ERROR ==="
        );

        console.error(error);

        setStatus(
          JSON.stringify(
            error,
            null,
            2
          )
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
          "=== MODEL ERROR ==="
        );

        console.error(error);

        setStatus(
          JSON.stringify(
            error,
            null,
            2
          )
        );
      }
    };

  const inspectViewer =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        console.log(
          "=== VIEWER API ==="
        );

        console.log(api.viewer);

        console.dir(api.viewer);

        setStatus(
          "Viewer dumped to console"
        );
      }
      catch (error: any) {
        console.error(error);

        setStatus(
          JSON.stringify(
            error,
            null,
            2
          )
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
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        <button
          onClick={getCamera}
        >
          Get Camera
        </button>

        <button
          onClick={getModels}
        >
          Get Models
        </button>

        <button
          onClick={inspectViewer}
        >
          Inspect Viewer
        </button>
      </div>

      <pre>
        {status}
      </pre>
    </div>
  );
}