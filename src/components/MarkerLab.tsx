import { useState } from "react";

import { workspaceService }
  from "../services/WorkspaceService";

export function MarkerLab() {
  const [status, setStatus] =
    useState("Ready");

  const createTestIcon =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        if (!api?.viewer) {
          setStatus(
            "Viewer API unavailable"
          );
          return;
        }

        const camera =
          await api.viewer.getCamera();

        console.log(
          "Camera",
          camera
        );

        setStatus(
          "Camera retrieved. Check console."
        );
      }
      catch (error) {
        console.error(error);

        setStatus(
          "Failed. Check console."
        );
      }
    };

  const createTestMarkup =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        if (!api?.markup) {
          setStatus(
            "Markup API unavailable"
          );
          return;
        }

        const markups =
          await api.markup
            .getSinglePointMarkups();

        console.log(
          "Existing Markups",
          markups
        );

        setStatus(
          "Markup query complete. Check console."
        );
      }
      catch (error) {
        console.error(error);

        setStatus(
          "Failed. Check console."
        );
      }
    };

  return (
    <div>
      <h2>Marker Lab</h2>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <button
          onClick={
            createTestIcon
          }
        >
          Test Viewer API
        </button>

        <button
          onClick={
            createTestMarkup
          }
        >
          Test Markup API
        </button>
      </div>

      <p>{status}</p>
    </div>
  );
}