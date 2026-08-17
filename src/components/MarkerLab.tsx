import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function MarkerLab() {
  const [status, setStatus] =
    useState("Ready");

  const testCamera =
    async () => {
      try {
        const api =
          workspaceService.getApi();

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
      catch (error) {
        console.error(error);

        setStatus(
          "Camera test failed"
        );
      }
    };

  const testModels =
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
      catch (error) {
        console.error(error);

        setStatus(
          "Model test failed"
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

        setStatus(
          "Viewer API dumped to console"
        );
      }
      catch (error) {
        console.error(error);

        setStatus(
          "Viewer inspection failed"
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
          onClick={testCamera}
        >
          Get Camera
        </button>

        <button
          onClick={testModels}
        >
          Get Models
        </button>

        <button
          onClick={inspectViewer}
        >
          Inspect Viewer
        </button>
      </div>

      <p>{status}</p>
    </div>
  );
}