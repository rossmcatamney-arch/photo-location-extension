import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function UserExtensionLab() {
  const [output, setOutput] =
    useState("");

  const inspectUser = async () => {
    try {
      const api =
        workspaceService.getApi();

      const report = {
        keys: Object.keys(
          api.user ?? {}
        ),
      };

      console.log(
        "=== USER API ==="
      );

      console.log(api.user);

      setOutput(
        JSON.stringify(
          report,
          null,
          2
        )
      );
    }
    catch (error) {
      console.error(error);

      setOutput(
        "Failed to inspect user API"
      );
    }
  };

  const inspectExtension =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const report = {
          keys: Object.keys(
            api.extension ?? {}
          ),
        };

        console.log(
          "=== EXTENSION API ==="
        );

        console.log(
          api.extension
        );

        setOutput(
          JSON.stringify(
            report,
            null,
            2
          )
        );
      }
      catch (error) {
        console.error(error);

        setOutput(
          "Failed to inspect extension API"
        );
      }
    };

  return (
    <div>
      <h2>
        User & Extension Lab
      </h2>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <button
          onClick={inspectUser}
        >
          Inspect User
        </button>

        <button
          onClick={
            inspectExtension
          }
        >
          Inspect Extension
        </button>
      </div>

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