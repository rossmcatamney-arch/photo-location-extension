import { useState } from "react";

import type {
  ProjectFile,
} from "../models/ProjectFile";

export interface FileSelectionPanelProps {
  title: string;

  items: ProjectFile[];

  onSelect: (
    item: ProjectFile
  ) => void;
}

export function FileSelectionPanel({
  title,
  items,
  onSelect,
}: FileSelectionPanelProps) {
  const [selectedId,
    setSelectedId] =
    useState("");

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: 8,
        padding: 16,
        marginTop: 12,
      }}
    >
      <h3>{title}</h3>

      {items.map(item => (
        <div
          key={item.id}
          style={{
            marginBottom: 8,
          }}
        >
          <label>
            <input
              type="radio"
              name={title}
              checked={
                selectedId === item.id
              }
              onChange={() =>
                setSelectedId(
                  item.id
                )
              }
            />

            {" "}

            {item.name}
          </label>
        </div>
      ))}

      <button
        disabled={!selectedId}
        onClick={() => {
          const selected =
            items.find(
              item =>
                item.id ===
                selectedId
            );

          if (selected) {
            onSelect(
              selected
            );
          }
        }}
      >
        Select
      </button>
    </div>
  );
}