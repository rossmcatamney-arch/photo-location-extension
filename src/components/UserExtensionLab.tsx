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

      setOutput(
        JSON.stringify(
          report,
          null,
          2
        )
      );

      console.log(
        "=== USER API ==="
      );

      console.log(api.user);
    }
    catch (error) {
      console.error(error);
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

        setOutput(
          JSON.stringify(
            report,
            null,
            2
          )
        );

        console.log(
          "=== EXTENSION API ==="
        );

        console.log(
          api.extension
        );
      }
      catch (error) {
        console.error(error);
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