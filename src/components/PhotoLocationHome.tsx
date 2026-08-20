import {
  useEffect,
  useState,
} from "react";

import type {
  PhotoLocationConfiguration,
} from "../models/PhotoLocationConfiguration";

import type {
  PhotoMatchingResult,
} from "../models/PhotoMatchingResult";

import type {
  ProjectFile,
} from "../models/ProjectFile";

import {
  photoLocationConfigurationService,
} from "../services/PhotoLocationConfigurationService";

import {
  trimbleProjectFilesService,
} from "../services/TrimbleProjectFilesService";

import {
  CsvService,
} from "../services/CsvService";

import {
  photoMatchingService,
} from "../services/PhotoMatchingService";

import {
  FolderBrowserDialog,
} from "./FolderBrowserDialog";

import {
  FileBrowserDialog,
} from "./FileBrowserDialog";

const APP_VERSION =
  "DEV-V30.0";

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
  ] = useState<PhotoLocationConfiguration>({
    projectId,

    photosFolderId: "",
    photosFolderPath: "",

    poseCsvFileId: "",
    poseCsvName: "",
  });

  const [
    saveStatus,
    setSaveStatus,
  ] = useState("");

const [
  discoveryStatus,
  setDiscoveryStatus,
] = useState("");

  const [
    matchingResult,
    setMatchingResult,
  ] =
    useState<PhotoMatchingResult | null>(
      null
    );

  const [
    discoveredFolders,
    setDiscoveredFolders,
  ] = useState<ProjectFile[]>([]);

  const [
    discoveredCsvs,
    setDiscoveredCsvs,
  ] = useState<ProjectFile[]>([]);

  const [
    showFolderBrowser,
    setShowFolderBrowser,
  ] = useState(false);

  const [
    showFileBrowser,
    setShowFileBrowser,
  ] = useState(false);

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

  const openFolderBrowser =
    async () => {

      try {

        if (
          discoveredFolders.length === 0
        ) {

          setDiscoveryStatus(
            "Discovering photo folders..."
          );

          const folders =
            await trimbleProjectFilesService
              .discoverFolders(
                projectId
              );

          setDiscoveredFolders(
            folders
          );

          setDiscoveryStatus(
            `Found ${folders.length} folders`
          );
        }

        setShowFolderBrowser(
          true
        );
      }
      catch (error) {

        console.error(
          error
        );

        setDiscoveryStatus(
          "Failed to discover photo folders"
        );
      }
    };

  const openFileBrowser =
    async () => {

      try {

        if (
          discoveredCsvs.length === 0
        ) {

          setDiscoveryStatus(
            "Discovering CSV files..."
          );

          const csvFiles =
            await trimbleProjectFilesService
              .discoverCsvFiles(
                projectId
              );

          setDiscoveredCsvs(
            csvFiles
          );

          setDiscoveryStatus(
            `Found ${csvFiles.length} CSV files`
          );
        }

        setShowFileBrowser(
          true
        );
      }
      catch (error) {

        console.error(
          error
        );

        setDiscoveryStatus(
          "Failed to discover CSV files"
        );
      }
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

  const validateMatching =
    async () => {

      try {

        setDiscoveryStatus(
          "Loading CSV..."
        );

const csvContent =
  await trimbleProjectFilesService
    .loadCsvContentById(
      projectId,
      configuration.poseCsvFileId
    );

        const poses =
          CsvService.parse(
            csvContent
          );

        setDiscoveryStatus(
          "Loading images..."
        );

       const imageFiles =
  await trimbleProjectFilesService
    .discoverImagesInFolder(
      configuration.photosFolderId
    );

console.log(
  "POSE COUNT",
  poses.length
);

console.log(
  "IMAGE COUNT",
  imageFiles.length
);

console.log(
  "FIRST IMAGE",
  imageFiles[0]
);

        const result =
          photoMatchingService.matchPhotos(
            poses,
            imageFiles
          );

        setMatchingResult(
          result
        );

        setDiscoveryStatus(
          "Matching complete"
        );
      }
      catch (error) {

        console.error(
          error
        );

        setDiscoveryStatus(
          "Validation failed"
        );
      }
    };

  return (
    <>
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
    color: "#666",
    fontSize: "0.9rem",
    marginBottom: 20,
  }}
>
  Developer Build: {APP_VERSION}
</div>

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

{discoveryStatus && (
  <div
    style={{
      marginBottom: 20,
      color: "#0066cc",
    }}
  >
    {discoveryStatus}
  </div>
)}

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
      marginTop: 8,
      padding: 12,
      border: "1px solid #ccc",
      borderRadius: 4,
      background: "#f5f5f5",
    }}
  >
    {configuration.poseCsvName ||
      "No CSV selected"}
  </div>

  <div
    style={{
      marginTop: 8,
    }}
  >
    <button
      onClick={
        openFileBrowser
      }
    >
      Browse CSV
    </button>
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
      marginTop: 8,
      padding: 12,
      border: "1px solid #ccc",
      borderRadius: 4,
      background: "#f5f5f5",
    }}
  >
    {configuration.photosFolderPath ||
      "No folder selected"}
  </div>

  <div
    style={{
      marginTop: 8,
    }}
  >
    <button
      onClick={
        openFolderBrowser
      }
    >
      Browse Folder
    </button>
  </div>
</div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 15,
          }}
        >
          <button
            onClick={
              saveConfiguration
            }
          >
            Save Configuration
          </button>

          <button
            onClick={
              validateMatching
            }
            disabled={
              !configuration.photosFolderId ||
              !configuration.poseCsvFileId
            }
          >
            Validate Matching
          </button>
        </div>

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

        {matchingResult && (
          <div
            style={{
              marginTop: 20,
              padding: 20,
              border: "1px solid #ccc",
              borderRadius: 8,
              background: "#f9f9f9",
            }}
          >
            <h3>
              Matching Results
            </h3>

            <div>
              Total Poses:{" "}
              {matchingResult.totalPoses}
            </div>

            <div>
              Available Images:{" "}
              {matchingResult.availableImages}
            </div>

            <div>
              Missing Images:{" "}
              {matchingResult.missingImages}
            </div>
          </div>
        )}

      </div>

      <FolderBrowserDialog
        isOpen={
          showFolderBrowser
        }
        folders={
          discoveredFolders
        }
        onClose={() =>
          setShowFolderBrowser(
            false
          )
        }
        onSelect={(folder) =>
          setConfiguration({
            ...configuration,

            photosFolderId:
              folder.id,

            photosFolderPath:
              folder.path,
          })
        }
      />

      <FileBrowserDialog
        isOpen={
          showFileBrowser
        }
        files={
          discoveredCsvs
        }
        onClose={() =>
          setShowFileBrowser(
            false
          )
        }
        onSelect={(file) =>
          setConfiguration({
            ...configuration,

            poseCsvFileId:
              file.id,

            poseCsvName:
              file.name,
          })
        }
      />
    </>
  );
}