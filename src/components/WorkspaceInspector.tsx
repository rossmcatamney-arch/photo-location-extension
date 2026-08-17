import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function WorkspaceInspector() {
  const [output, setOutput] =
    useState("");

  const inspectWorkspace = () => {
    const api =
      workspaceService.getApi();

    if (!api) {
      setOutput(
        "Workspace not connected"
      );

      return;
    }

    const rootProperties =
      Object.keys(api);

    setOutput(
      JSON.stringify(
        rootProperties,
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
        onClick={inspectWorkspace}
      >
        Inspect Root Workspace
      </button>

      <pre
        style={{
          marginTop: 10,
          maxHeight: 400,
          overflow: "auto",
          border: "1px solid #444",
          padding: 10,
          borderRadius: 4,
        }}
      >
        {output}
      </pre>
    </div>
  );
}