import {
  useMemo,
  useState,
} from "react";

import type {
  FileTreeNode,
} from "../models/FileTreeNode";

import type {
  ProjectFile,
} from "../models/ProjectFile";

import {
  buildFileTree,
} from "../utils/buildFileTree";

export interface FolderBrowserDialogProps {
  isOpen: boolean;
  folders: ProjectFile[];
  onClose: () => void;
  onSelect: (
    folder: ProjectFile
  ) => void;
}

interface TreeNodeProps {
  node: FileTreeNode;
  level: number;
  onSelect: (
    folder: ProjectFile
  ) => void;
}

function TreeNode({
  node,
  level,
  onSelect,
}: TreeNodeProps) {

  const [
    expanded,
    setExpanded,
  ] = useState(level < 2);

  const hasChildren =
    node.children.length > 0;

  return (
    <div>

      <div
        style={{
          paddingLeft:
            level * 20,
          display: "flex",
          alignItems:
            "center",
          gap: 8,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >

        {hasChildren ? (
          <button
            onClick={() =>
              setExpanded(
                !expanded
              )
            }
            style={{
              width: 24,
            }}
          >
            {expanded
              ? "−"
              : "+"}
          </button>
        ) : (
          <div
            style={{
              width: 24,
            }}
          />
        )}

        <div
          style={{
            cursor: "pointer",
            flex: 1,
          }}
          onClick={() => {

            if (
              node.folder
            ) {
              onSelect(
                node.folder
              );
            }
          }}
        >
          📁 {node.name}
        </div>

      </div>

      {expanded &&
        node.children.map(
          (child) => (
            <TreeNode
              key={
                child.path
              }
              node={child}
              level={
                level + 1
              }
              onSelect={
                onSelect
              }
            />
          )
        )}

    </div>
  );
}

export function FolderBrowserDialog({
  isOpen,
  folders,
  onClose,
  onSelect,
}: FolderBrowserDialogProps) {

  const tree =
    useMemo(
      () =>
        buildFileTree(
          folders
        ),
      [folders]
    );

  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor:
          "rgba(0,0,0,0.5)",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        style={{
          background:
            "#ffffff",
          width: "900px",
          maxHeight:
            "80vh",
          overflowY:
            "auto",
          margin:
            "40px auto",
          padding:
            "20px",
          borderRadius:
            "8px",
          boxShadow:
            "0 4px 16px rgba(0,0,0,0.25)",
        }}
      >

        <h3>
          Select Photos Folder
        </h3>

        <div
          style={{
            marginBottom:
              20,
            color:
              "#666",
          }}
        >
          Browse the project
          structure and
          select the folder
          containing the
          panorama images.
        </div>

        <div
          style={{
            border:
              "1px solid #ddd",
            padding:
              "10px",
            borderRadius:
              "4px",
          }}
        >
          {tree.map(
            (node) => (
              <TreeNode
                key={
                  node.path
                }
                node={node}
                level={0}
                onSelect={(
                  folder
                ) => {
                  onSelect(
                    folder
                  );
                  onClose();
                }}
              />
            )
          )}
        </div>

        <div
          style={{
            marginTop:
              20,
            display:
              "flex",
            justifyContent:
              "flex-end",
          }}
        >
          <button
            onClick={
              onClose
            }
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}