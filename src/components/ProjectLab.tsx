import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function ProjectLab() {
  const [output, setOutput] =
    useState("");

  const getCurrentProject =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const project =
          await api.project.getCurrentProject();

        const text =
          JSON.stringify(
            project,
            null,
            2
          );

        console.log(
          "=== CURRENT PROJECT ==="
        );

        console.log(project);

        setOutput(text);
      }
      catch (error) {
        console.error(error);

        setOutput(
          "Failed to retrieve current project"
        );
      }
    };

  const getMembers =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const members =
          await api.project.getMembers();

        const text =
          JSON.stringify(
            members,
            null,
            2
          );

        console.log(
          "=== PROJECT MEMBERS ==="
        );

        console.log(members);

        setOutput(text);
      }
      catch (error) {
        console.error(error);

        setOutput(
          "Failed to retrieve members"
        );
      }
    };

  const getSettings =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const settings =
          await api.project.getSettings();

        const text =
          JSON.stringify(
            settings,
            null,
            2
          );

        console.log(
          "=== PROJECT SETTINGS ==="
        );

        console.log(settings);

        setOutput(text);
      }
      catch (error) {
        console.error(error);

        setOutput(
          "Failed to retrieve settings"
        );
      }
    };

  return (
    <div>
      <h2>Project Lab</h2>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        <button
          onClick={
            getCurrentProject
          }
        >
          Current Project
        </button>

        <button
          onClick={getMembers}
        >
          Members
        </button>

        <button
          onClick={getSettings}
        >
          Settings
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