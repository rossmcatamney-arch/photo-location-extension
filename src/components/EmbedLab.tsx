import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function EmbedLab() {
  const [output, setOutput] =
    useState("");

  const inspectEmbed =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const report = {
          embedKeys:
            Object.keys(
              api.embed ?? {}
            ),
        };

        console.log(
          "=== EMBED API ==="
        );

        console.log(api.embed);

        console.log(
          "=== EMBED KEYS ==="
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
        Embed Lab
      </h2>

      <button
        onClick={inspectEmbed}
      >
        Inspect Embed API
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