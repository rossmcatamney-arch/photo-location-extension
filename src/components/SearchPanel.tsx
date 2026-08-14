import { useState } from "react";

import type { PhotoPose } from "../models/PhotoPose";

interface Props {
  poses: PhotoPose[];

  onSelect: (
    pose: PhotoPose
  ) => void;
}

export function SearchPanel({
  poses,
  onSelect,
}: Props) {
  const [search, setSearch] =
    useState("");

  const results =
    search.length < 3
      ? []
      : poses
          .filter((p) =>
            p.imageName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          )
          .slice(0, 20);

  return (
    <div>
      <h3>Search</h3>

      <input
        type="text"
        placeholder="Search image..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 10,
        }}
      />

      <div
        style={{
          maxHeight: 250,
          overflowY: "auto",
        }}
      >
        {results.map(
          (result) => (
            <div
              key={
                result.imageName
              }
              style={{
                cursor:
                  "pointer",
                padding: 6,
                borderBottom:
                  "1px solid #333",
              }}
              onClick={() =>
                onSelect(
                  result
                )
              }
            >
              {
                result.imageName
              }
            </div>
          )
        )}
      </div>
    </div>
  );
}