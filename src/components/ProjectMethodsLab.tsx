import { useState } from "react";

import {
  workspaceService,
} from "../services/WorkspaceService";

export function ProjectMethodsLab() {
  const [output, setOutput] =
    useState("");

  const inspectMethods =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const report = {
          rootKeys:
            Object.keys(api ?? {}),

          projectKeys:
            Object.keys(
              api?.project ?? {}
            ),

          viewerKeys:
            Object.keys(
              api?.viewer ?? {}
            ),

          uiKeys:
            Object.keys(
              api?.ui ?? {}
            ),

          extensionKeys:
            Object.keys(
              api?.extension ?? {}
            ),
        };

        console.log(
          "=== WORKSPACE REPORT ==="
        );

        console.log(report);

        setOutput(
          JSON.stringify(
            report,
            null,
            2
          )
        );
      }
      catch (error: any) {
        console.error(error);

        setOutput(
          JSON.stringify(
            error,
            Object.getOwnPropertyNames(
              error
            ),
            2
          )
        );
      }
    };

  return (
    <div>
      <h2>
        Workspace Report
      </h2>

      <button
        onClick={
          inspectMethods
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