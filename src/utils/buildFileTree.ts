import type {
  FileTreeNode,
} from "../models/FileTreeNode";

export function buildFileTree(
  paths: string[]
): FileTreeNode[] {
  const root: FileTreeNode = {
    name: "ROOT",
    path: "",
    children: [],
  };

  for (const fullPath of paths) {
    const parts = fullPath
      .split("/")
      .filter(Boolean);

    let current = root;
    let currentPath = "";

    for (const part of parts) {
      currentPath += "/" + part;

      let existing =
        current.children.find(
          (child) =>
            child.name === part
        );

      if (!existing) {
        existing = {
          name: part,
          path: currentPath,
          children: [],
        };

        current.children.push(
          existing
        );
      }

      current = existing;
    }
  }

  return root.children;
}