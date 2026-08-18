export interface FileTreeNode {
  name: string;
  path: string;
  children: FileTreeNode[];
}