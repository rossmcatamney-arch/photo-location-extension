import { useState } from "react";

import {
  panoramaProjectService,
} from "../services/PanoramaProjectService";

export interface PanoramaProjectLabProps {
  projectId: string;
}

export function PanoramaProjectLab({
  projectId,
}: PanoramaProjectLabProps) {

  const [
    status,
    setStatus,
  ] = useState("Ready");

  const [
    csvCount,
    setCsvCount,
  ] = useState(0);

  const [
    imageCount,
    setImageCount,
  ] = useState(0);

  const [
    csvFiles,
    setCsvFiles,
  ] = useState<any[]>([]);

  const discoverProject =
    async () => {

      try {

        setStatus(
          "Discovering project files..."
        );

        const discoveredCsvs =
          await panoramaProjectService
            .discoverCsvFiles(
              projectId
            );

        const discoveredImages =
          await panoramaProjectService
            .discoverImageFiles(
              projectId
            );

        setCsvFiles(
          discoveredCsvs
        );

        setCsvCount(
          discoveredCsvs.length
        );

        setImageCount(
          discoveredImages.length
        );

        setStatus(
          "Discovery complete"
        );
      }
      catch (error) {

        console.error(
          error
        );

        setStatus(
          "Discovery failed"
        );
      }
    };

  return (
    <div
      style={{
        border:
          "1px solid #444",
        borderRadius: 8,
        padding: 20,
      }}
    >
      <h2>
        Panorama Project Lab
      </h2>

      <button
        onClick={
          discoverProject
        }
      >
        Discover Panorama Project
      </button>

      <div
        style={{
          marginTop: 20,
        }}
      >
        <div>
          Status: {status}
        </div>

        <div>
          CSV Files:
          {" "}
          {csvCount}
        </div>

        <div>
          Images:
          {" "}
          {imageCount}
        </div>
      </div>

      {csvFiles.length > 0 && (
        <>
          <h3>
            CSV Files
          </h3>

          <div>
            {csvFiles.map(
              file => (
                <div
                  key={file.id}
                >
                  📄 {file.name}
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}