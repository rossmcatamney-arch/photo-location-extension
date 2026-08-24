import type {
  FileTreeNode,
} from "../models/FileTreeNode";

import type {
  ProjectFile,
} from "../models/ProjectFile";

export function buildFolderTree(
  folders: ProjectFile[]
): FileTreeNode[] {

  return folders.map(
    (folder): FileTreeNode => ({

      name: folder.name,

      path: folder.path,

      folder,

      children: [],

      isLoaded: false,

      isExpanded: false,

    })
  );
}
