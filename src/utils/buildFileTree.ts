import type {
  FileTreeNode,
} from "../models/FileTreeNode";

import type {
  ProjectFile,
} from "../models/ProjectFile";

export function buildFileTree(
  items: ProjectFile[]
): FileTreeNode[] {

  return items.map(
    (item): FileTreeNode => ({

      name: item.name,

      path: item.path,

      folder: item,

      children: [],

      isLoaded: false,

      isExpanded: false,

    })
  );
}