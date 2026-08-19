import type {
  ProjectFile,
} from "./ProjectFile";

export interface FileTreeNode {
  name: string;
  path: string;
  folder?: ProjectFile;
  children: FileTreeNode[];
}