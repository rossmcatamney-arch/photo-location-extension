import type {
  FileTreeNode,
} from "../models/FileTreeNode";

import type {
  ProjectFile,
} from "../models/ProjectFile";

export function buildFileTree(
  folders: ProjectFile[]
): FileTreeNode[] {

  const root: FileTreeNode = {
    name: "ROOT",
    path: "",
    children: [],
  };

  for (const folder of folders) {

    const parts =
      folder.path
        .split("/")
        .filter(Boolean);

    let current = root;
    let currentPath = "";

    for (
      let i = 0;
      i < parts.length;
      i++
    ) {

      const part =
        parts[i];

      currentPath +=
        "/" + part;

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

      if (
        i === parts.length - 1
      ) {
        existing.folder =
          folder;
      }

      current = existing;
    }
  }

  return root.children;
}