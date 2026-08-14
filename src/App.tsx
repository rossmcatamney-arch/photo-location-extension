import { useState } from "react";

import { ImportPanel } from "./components/ImportPanel";
import { DetailsPanel } from "./components/DetailsPanel";
import { CoordinateView } from "./components/CoordinateView";

import { CsvService } from "./services/CsvService";

import type { PhotoPose } from "./models/PhotoPose";

function App() {
  const [poses, setPoses] =
    useState<PhotoPose[]>([]);

  const [selectedPose, setSelectedPose] =
    useState<PhotoPose>();

  const handleLoaded = (
    content: string
  ) => {
    const parsed =
      CsvService.parse(content);

    console.log(
      "First Pose",
      parsed[0]
    );

    console.log(
      "Last Pose",
      parsed[parsed.length - 1]
    );

    setPoses(parsed);

    if (parsed.length > 0) {
      setSelectedPose(parsed[0]);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <h1>
        Photo Location Extension
      </h1>

      <ImportPanel
        onLoaded={handleLoaded}
      />

      <h2>
        Photos Loaded: {poses.length}
      </h2>

      {poses.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 350px",
            gap: 20,
            marginTop: 20,
          }}
        >
          <div
            style={{
              border:
                "1px solid #444",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <CoordinateView
              poses={poses}
              selected={selectedPose}
              onSelect={
                setSelectedPose
              }
            />
          </div>

          <div
            style={{
              border:
                "1px solid #444",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <DetailsPanel
              pose={selectedPose}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;