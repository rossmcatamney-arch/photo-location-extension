import { useState } from "react";

import {
  workspaceService,
} from "../services/WorkspaceService";

export function ExtensionLab() {
  const [output, setOutput] =
    useState("");

  const getAccessToken =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const result =
          await api.extension
            .requestPermission(
              "accesstoken"
            );

        console.log(
          "PERMISSION RESULT",
          result
        );

        console.log(
          "RESULT TYPE",
          typeof result
        );

        setOutput(
          JSON.stringify(
            {
              result,
              type:
                typeof result,
              length:
                result?.length,
            },
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
        Extension Lab
      </h2>

      <button
        onClick={getAccessToken}
      >
        Request Access Token
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