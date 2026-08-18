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

import {
  trimbleProjectFilesService,
} from "../services/TrimbleProjectFilesService";

import {
  FolderBrowserDialog,
} from "./FolderBrowserDialog";

import {
  FileBrowserDialog,
} from "./FileBrowserDialog";

const APP_VERSION =
2
"DEV-V28.1";

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
    photosFolder: "",
    poseCsv: "",
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
    discoveredFolders,
    setDiscoveredFolders,
  ] = useState<string[]>([]);

  const [
    discoveredCsvs,
    setDiscoveredCsvs,
  ] = useState<string[]>([]);

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
      setConfiguration(existing);
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
              .discoverImageFolders(
                projectId
              );

          setDiscoveredFolders(
            folders
          );

          setDiscoveryStatus(
            `Found ${folders.length} photo folders`
          );
        }

        setShowFolderBrowser(
          true
        );

      }
      catch (error) {

        console.error(error);

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
            csvFiles.map(
              file => file.path
            )
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

        console.error(error);

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
            {configuration.photosFolder ||
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
            {configuration.poseCsv ||
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

        <div
          style={{
            marginTop: 20,
            borderTop:
              "1px solid #444",
            paddingTop: 20,
          }}
        >
          <strong>
            Current Configuration
          </strong>

          <pre>
            {JSON.stringify(
              configuration,
              null,
              2
            )}
          </pre>
        </div>
      </div>

      <FolderBrowserDialog
        isOpen={
          showFolderBrowser
        }
        folders={
          discoveredFolders
        }
        onClose={() =>
          setShowFolderBrowser(false)
        }
        onSelect={(folder) =>
          setConfiguration({
            ...configuration,
            photosFolder: folder,
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
          setShowFileBrowser(false)
        }
        onSelect={(file) =>
          setConfiguration({
            ...configuration,
            poseCsv: file,
          })
        }
      />
    </>
  );
}