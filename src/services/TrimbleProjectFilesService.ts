import type {
  ProjectFile,
} from "../models/ProjectFile";

import {
  coreApiService,
} from "./CoreApiService";

export class TrimbleProjectFilesService {
  public async discoverFolders(
    projectId: string
  ): Promise<ProjectFile[]> {
    const folders =
      await coreApiService.getFolders(
        projectId
      );

    return folders as ProjectFile[];
  }

  public async discoverFiles(
    projectId: string
  ): Promise<ProjectFile[]> {
    const files =
      await coreApiService.getFiles(
        projectId
      );

    return files as ProjectFile[];
  }

  public async discoverCsvFiles(
    projectId: string
  ): Promise<ProjectFile[]> {
    const files =
      await this.discoverFiles(
        projectId
      );

    return files.filter(
      file =>
        file.name
          .toLowerCase()
          .endsWith(".csv")
    );
  }

  public async discoverImageFiles(
    projectId: string
  ): Promise<ProjectFile[]> {
    const files =
      await this.discoverFiles(
        projectId
      );

    return files.filter(
      file => {
        const name =
          file.name.toLowerCase();

        return (
          name.endsWith(".jpg") ||
          name.endsWith(".jpeg") ||
          name.endsWith(".png")
        );
      }
    );
  }

  public async runDiscovery(
    projectId: string
  ): Promise<void> {
    console.log(
      "=== PHOTO LOCATION DISCOVERY ==="
    );

    console.log(
      "Project:",
      projectId
    );

    const folders =
      await this.discoverFolders(
        projectId
      );

    const files =
      await this.discoverFiles(
        projectId
      );

    console.log(
      "Folders",
      folders
    );

    console.log(
      "Files",
      files
    );
  }
}

export const trimbleProjectFilesService =
  new TrimbleProjectFilesService();