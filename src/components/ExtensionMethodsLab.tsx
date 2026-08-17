import { useState } from "react";

import {
  workspaceService,
} from "../services/WorkspaceService";

export function ExtensionMethodsLab() {
  const [output, setOutput] =
    useState("");

  const inspectMethods =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const methods =
          Object.keys(
            api.extension ?? {}
          );

        console.log(
          "=== EXTENSION METHODS ==="
        );

        console.log(
          methods
        );

        setOutput(
          JSON.stringify(
            methods,
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
        Extension Methods
      </h2>

      <button
        onClick={
          inspectMethods
        }
      >
        Inspect Extension Methods
      </button>

      <pre
        style={{
          maxHeight: 300,
          overflow: "auto",
        }}
      >
        {output}
      </pre>
    </div>
  );
}