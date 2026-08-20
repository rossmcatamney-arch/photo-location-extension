import {
  useState,
} from "react";

import type {
  PhotoNode,
} from "../models/PhotoNode";

export interface PhotoMapProps {

  photoNodes: PhotoNode[];

  selectedPhoto:
    PhotoNode | null;

  onPhotoSelected: (
    photo: PhotoNode
  ) => void;

}

export function PhotoMap({
  photoNodes,
  selectedPhoto,
  onPhotoSelected,
}: PhotoMapProps) {

  const [
    zoom,
    setZoom,
  ] = useState(1);

  if (
    photoNodes.length === 0
  ) {

    return (
      <div>
        No photo nodes loaded.
      </div>
    );

  }

  const minX =
    Math.min(
      ...photoNodes.map(
        photo => photo.x
      )
    );

  const maxX =
    Math.max(
      ...photoNodes.map(
        photo => photo.x
      )
    );

  const minY =
    Math.min(
      ...photoNodes.map(
        photo => photo.y
      )
    );

  const maxY =
    Math.max(
      ...photoNodes.map(
        photo => photo.y
      )
    );

  const width = 800;
  const height = 500;

  const dataWidth =
    maxX - minX || 1;

  const dataHeight =
    maxY - minY || 1;

  return (

    <div
      style={{
        border:
          "1px solid #ccc",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >

      <div
        style={{
          padding: 10,
          background: "#333",
          color: "white",
          fontSize: 12,
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
        }}
      >

        <div>

          Photo Nodes:
          {" "}
          {photoNodes.length}

          {selectedPhoto && (
            <>
              {" | "}
              Selected:
              {" "}
              {
                selectedPhoto.imageName
              }
            </>
          )}

        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >

          <button
            onClick={() =>
              setZoom(
                zoom * 1.25
              )
            }
          >
            +
          </button>

          <button
            onClick={() =>
              setZoom(
                zoom / 1.25
              )
            }
          >
            -
          </button>

          <button
            onClick={() =>
              setZoom(1)
            }
          >
            Reset
          </button>

        </div>

      </div>

      <svg
        height={height}
        width="100%"
        viewBox={`0 0 ${width / zoom} ${height / zoom}`}
        style={{
          background:
            "#1e1e1e",
        }}
      >

        {photoNodes.map(
          photo => {

            const x =
              ((photo.x - minX) /
                dataWidth)
              * width;

            const y =
              height -
              (((photo.y - minY) /
                dataHeight)
              * height);

            const selected =
              selectedPhoto?.id ===
              photo.id;

            return (

              <circle
                key={photo.id}
                cx={x}
                cy={y}
                r={
                  selected
                    ? 8
                    : 2
                }
                fill={
                  selected
                    ? "#ff6600"
                    : "#00ccff"
                }
                stroke={
                  selected
                    ? "white"
                    : "none"
                }
                strokeWidth={
                  selected
                    ? 2
                    : 0
                }
                style={{
                  cursor:
                    "pointer",
                }}
                onClick={() =>
                  onPhotoSelected(
                    photo
                  )
                }
              />

            );

          }
        )}

      </svg>

    </div>

  );

}