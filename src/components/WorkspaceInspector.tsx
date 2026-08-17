import { useState } from "react";

import {
  workspaceService,
} from "../services/WorkspaceService";

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

    const report = {
      rootKeys:
        Object.keys(api),

      viewerKeys:
        api.viewer
          ? Object.keys(
              api.viewer
            )
          : [],

      markupKeys:
        api.markup
          ? Object.keys(
              api.markup
            )
          : [],

      projectKeys:
        api.project
          ? Object.keys(
              api.project
            )
          : [],

      uiKeys:
        api.ui
          ? Object.keys(
              api.ui
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
          maxHeight: 500,
          overflow: "auto",
        }}
      >
        {output}
      </pre>
    </div>
  );
}