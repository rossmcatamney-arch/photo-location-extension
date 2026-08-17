import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function ApiExplorer() {
  const [output, setOutput] =
    useState("");

  const inspectApi = (
    name: string,
    api: any
  ) => {
    if (!api) {
      setOutput(
        `${name} API not available`
      );

      return;
    }

    const methods =
      Object.getOwnPropertyNames(
        Object.getPrototypeOf(api)
      );

    const properties =
      Object.keys(api);

    setOutput(
      JSON.stringify(
        {
          api: name,
          methods,
          properties,
        },
        null,
        2
      )
    );
  };

  const api =
    workspaceService.getApi();

  return (
    <div>
      <h2>API Explorer</h2>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        <button
          onClick={() =>
            inspectApi(
              "viewer",
              api?.viewer
            )
          }
        >
          Viewer API
        </button>

        <button
          onClick={() =>
            inspectApi(
              "markup",
              api?.markup
            )
          }
        >
          Markup API
        </button>

        <button
          onClick={() =>
            inspectApi(
              "project",
              api?.project
            )
          }
        >
          Project API
        </button>

        <button
          onClick={() =>
            inspectApi(
              "ui",
              api?.ui
            )
          }
        >
          UI API
        </button>
      </div>

      <pre
        style={{
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