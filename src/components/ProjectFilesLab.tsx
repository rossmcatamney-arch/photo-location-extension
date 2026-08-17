import { useState } from "react";

export interface ProjectFilesLabProps {
  projectId: string;
}

export function ProjectFilesLab({
  projectId,
}: ProjectFilesLabProps) {
  const [output, setOutput] =
    useState("");

  const discoverFiles =
    async () => {
      setOutput(
        JSON.stringify(
          {
            projectId,
            status:
              "Ready for Core API integration",
          },
          null,
          2
        )
      );
    };

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: 8,
        padding: 20,
      }}
    >
      <h2>
        Project Files
      </h2>

      <div
        style={{
          marginBottom: 12,
        }}
      >
        Current Project Id:
      </div>

      <code>
        {projectId}
      </code>

      <div
        style={{
          marginTop: 16,
        }}
      >
        <button
          onClick={
            discoverFiles
          }
        >
          Discover Project Files
        </button>
      </div>

      <pre
        style={{
          marginTop: 16,
          maxHeight: 400,
          overflow: "auto",
        }}
      >
        {output}
      </pre>
    </div>
  );
}
