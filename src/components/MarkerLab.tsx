import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function MarkerLab() {
  const [status, setStatus] =
    useState("Ready");

  const getCurrentProject =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const project =
          await api.project
            .getCurrentProject();

        console.log(
          "=== CURRENT PROJECT ==="
        );

        console.log(project);

        setStatus(
          "Current project dumped to console"
        );
      }
      catch (error: any) {
        console.error(error);

        setStatus(
          error?.message ??
          "Project query failed"
        );
      }
    };

  const getProjectMembers =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const members =
          await api.project
            .getMembers();

        console.log(
          "=== PROJECT MEMBERS ==="
        );

        console.log(members);

        setStatus(
          "Project members dumped to console"
        );
      }
      catch (error: any) {
        console.error(error);

        setStatus(
          error?.message ??
          "Member query failed"
        );
      }
    };

  const getProjectSettings =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const settings =
          await api.project
            .getSettings();

        console.log(
          "=== PROJECT SETTINGS ==="
        );

        console.log(settings);

        setStatus(
          "Project settings dumped to console"
        );
      }
      catch (error: any) {
        console.error(error);

        setStatus(
          error?.message ??
          "Settings query failed"
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
        }}
      >
        <button
          onClick={
            getCurrentProject
          }
        >
          Get Current Project
        </button>

        <button
          onClick={
            getProjectMembers
          }
        >
          Get Members
        </button>

        <button
          onClick={
            getProjectSettings
          }
        >
          Get Settings
        </button>
      </div>

      <pre>
        {status}
      </pre>
    </div>
  );
}