import {
  useEffect,
  useState,
} from "react";

import type {
  PhotoLocationConfiguration,
} from "../models/PhotoLocationConfiguration";

import {
  photoLocationConfigurationService,
} from "../services/PhotoLocationConfigurationService";

export interface PhotoLocationHomeProps {
  projectName: string;
  projectId: string;
}

export function PhotoLocationHome({
  projectName,
  projectId,
}: PhotoLocationHomeProps) {
  const [
    configuration,
    setConfiguration,
  ] = useState<
    PhotoLocationConfiguration
  >({
    projectId,
    photosFolder: "",
    poseCsv: "",
  });

  const [
    saveStatus,
    setSaveStatus,
  ] = useState("");

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const existing =
      photoLocationConfigurationService.load(
        projectId
      );

    if (existing) {
      setConfiguration(
        existing
      );
    }
  }, [projectId]);

  const selectPhotosFolder =
    () => {
      console.log(
        "Photos folder selection not implemented yet"
      );
    };

  const selectPoseCsv =
    () => {
      console.log(
        "Pose CSV selection not implemented yet"
      );
    };

  const saveConfiguration =
    () => {
      const updated = {
        ...configuration,
        projectId,
      };

      photoLocationConfigurationService.save(
        updated
      );

      setSaveStatus(
        "✓ Configuration Saved"
      );
    };

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
      }}
    >
      <h2>
        Photo Location
      </h2>

      <div
        style={{
          marginBottom: 20,
        }}
      >
        <strong>
          Current Project
        </strong>

        <div>
          {projectName}
        </div>
      </div>

      <div
        style={{
          marginBottom: 20,
        }}
      >
        <strong>
          Photos Folder
        </strong>

        <div
          style={{
            marginTop: 6,
            marginBottom: 10,
          }}
        >
          {
            configuration.photosFolder ||
            "Not Selected"
          }
        </div>

        <button
          onClick={
            selectPhotosFolder
          }
        >
          Select Photos Folder
        </button>
      </div>

      <div
        style={{
          marginBottom: 20,
        }}
      >
        <strong>
          Pose CSV
        </strong>

        <div
          style={{
            marginTop: 6,
            marginBottom: 10,
          }}
        >
          {
            configuration.poseCsv ||
            "Not Selected"
          }
        </div>

        <button
          onClick={
            selectPoseCsv
          }
        >
          Select Pose CSV
        </button>
      </div>

      <button
        onClick={
          saveConfiguration
        }
      >
        Save Configuration
      </button>

      {saveStatus && (
        <div
          style={{
            marginTop: 12,
            color: "#008000",
          }}
        >
          {saveStatus}
        </div>
      )}
    </div>
  );
}