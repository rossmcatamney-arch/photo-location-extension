export interface ProjectFile {
  id: string;

  name: string;

  path: string;

  type:
    | "folder"
    | "csv"
    | "image"
    | "file";
}