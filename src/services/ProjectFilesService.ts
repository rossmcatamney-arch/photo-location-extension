import type {
  ProjectFile,
} from "../models/ProjectFile";

import {
  trimbleProjectFilesService,
} from "./TrimbleProjectFilesService";

export class ProjectFilesService {
  public async getPhotoFolders(
    projectId: string
  ): Promise<ProjectFile[]> {
    return trimbleProjectFilesService
      .discoverFolders(
        projectId
      );
  }

  public async getPoseCsvFiles(
    projectId: string
  ): Promise<ProjectFile[]> {
    return trimbleProjectFilesService
      .discoverCsvFiles(
        projectId
      );
  }
}

export const projectFilesService =
  new ProjectFilesService();