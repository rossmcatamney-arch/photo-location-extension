import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function ExtensionLab() {
  const [output, setOutput] =
    useState("");

  const getHost = async () => {
    try {
      const api =
        workspaceService.getApi();

      const result =
        await api.extension.getHost();

      console.log(
        "=== HOST ==="
      );

      console.log(result);

      setOutput(
        JSON.stringify(
          result,
          null,
          2
        )
      );
    }
    catch (error: any) {
      console.error(
        "=== HOST ERROR ==="
      );

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

  const getPermission =
    async () => {
      try {
        const api =
          workspaceService.getApi();

      const result =
        await api.extension.getPermission();

        console.log(
          "=== PERMISSION ==="
        );

        console.log(result);

        setOutput(
          JSON.stringify(
            result,
            null,
            2
          )
        );
      }
      catch (error: any) {
        console.error(
          "=== PERMISSION ERROR ==="
        );

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

  const getStatus =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const result =
          await api.extension
            .getStatusMessage();

        console.log(
          "=== STATUS ==="
        );

        console.log(result);

        setOutput(
          JSON.stringify(
            result,
            null,
            2
          )
        );
      }
      catch (error: any) {
        console.error(
          "=== STATUS ERROR ==="
        );

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
        Extension Lab
      </h2>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={getHost}
        >
          Get Host
        </button>

        <button
          onClick={
            getPermission
          }
        >
          Get Permission
        </button>

        <button
          onClick={getStatus}
        >
          Get Status
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