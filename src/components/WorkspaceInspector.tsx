import { useState } from "react";

import {
  workspaceService,
} from "../services/WorkspaceService";

export function WorkspaceInspector() {
  const [output, setOutput] =
    useState("");

  const inspectWorkspace =
    () => {
      const api =
        workspaceService.getApi();

      if (!api) {
        setOutput(
          "Workspace not connected"
        );

        return;
      }

      const report = {
        rootKeys:
          Object.keys(api),

        userKeys:
          api.user
            ? Object.keys(
                api.user
              )
            : [],

        projectKeys:
          api.project
            ? Object.keys(
                api.project
              )
            : [],

        viewerKeys:
          api.viewer
            ? Object.keys(
                api.viewer
              )
            : [],
      };

      setOutput(
        JSON.stringify(
          report,
          null,
          2
        )
      );
    };

  return (
    <div>
      <h2>
        Workspace Inspector
      </h2>

      <button
        onClick={
          inspectWorkspace
        }
      >
        Inspect Workspace
      </button>

      <pre
        style={{
          maxHeight: 600,
          overflow: "auto",
        }}
      >
        {output}
      </pre>
    </div>
  );
}