import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function FileDiscoveryLab() {
  const [output, setOutput] =
    useState("");

  const inspectApis =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const report = {
          rootKeys:
            Object.keys(api ?? {}),

          dataTableKeys:
            Object.keys(
              api.dataTable ?? {}
            ),

          modelsPanelKeys:
            Object.keys(
              api.modelsPanel ?? {}
            ),

          viewKeys:
            Object.keys(
              api.view ?? {}
            ),

          projectKeys:
            Object.keys(
              api.project ?? {}
            ),
        };

        console.log(
          "=== FILE DISCOVERY ==="
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
        File Discovery Lab
      </h2>

      <button
        onClick={inspectApis}
      >
        Inspect File APIs
      </button>

      <pre
        style={{
          maxHeight: 400,
          overflow: "auto",
        }}
      >
        {output}
      </pre>
    </div>
  );
}