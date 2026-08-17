import { useState } from "react";

import { ImportPanel } from "./components/ImportPanel";
import { CoordinateView } from "./components/CoordinateView";
import { DetailsPanel } from "./components/DetailsPanel";
import { MiniMap } from "./components/MiniMap";
import { StatisticsPanel } from "./components/StatisticsPanel";
import { SearchPanel } from "./components/SearchPanel";

import { DeveloperWorkbench } from "./pages/DeveloperWorkbench";

import { CsvService } from "./services/CsvService";

import type { PhotoPose } from "./models/PhotoPose";

function App() {
  const [poses, setPoses] =
    useState<PhotoPose[]>([]);

  const [selectedPose, setSelectedPose] =
    useState<PhotoPose>();

  const [developerMode, setDeveloperMode] =
    useState(false);

  const handleLoaded = (
    content: string
  ) => {
    const parsed =
      CsvService.parse(content);

    setPoses(parsed);

    if (parsed.length > 0) {
      setSelectedPose(parsed[0]);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 1600,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>
          Photo Location
        </h1>

        <div>
          <button
            onClick={() =>
              setDeveloperMode(false)
            }
            style={{
              marginRight: 10,
              padding: "8px 16px",
            }}
          >
            Viewer
          </button>

          <button
            onClick={() =>
              setDeveloperMode(true)
            }
            style={{
              padding: "8px 16px",
            }}
          >
            Developer
          </button>
        </div>
      </div>

      {developerMode ? (
        <DeveloperWorkbench />
      ) : (
        <>
          <ImportPanel
            onLoaded={handleLoaded}
          />

          <h2>
            Photos Loaded:
            {" "}
            {poses.length}
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
                  selected={
                    selectedPose
                  }
                  onSelect={
                    setSelectedPose
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    border:
                      "1px solid #444",
                    padding: 20,
                    borderRadius: 8,
                  }}
                >
                  <SearchPanel
                    poses={poses}
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
                    pose={
                      selectedPose
                    }
                  />
                </div>

                <div
                  style={{
                    border:
                      "1px solid #444",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  <h3>Mini Map</h3>

                  <MiniMap
                    poses={poses}
                    selected={
                      selectedPose
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
                  <StatisticsPanel
                    poses={poses}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;