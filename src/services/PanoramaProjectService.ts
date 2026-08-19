import type {
  ProjectFile,
} from "../models/ProjectFile";

import type {
  PanoramaPose,
} from "./PanoramaPoseParser";

import {
  panoramaPoseParser,
} from "./PanoramaPoseParser";

import {
  coreApiService,
} from "./CoreApiService";

export interface PanoramaProjectData {
  poses: PanoramaPose[];

  csvFile?: ProjectFile;

  imageFiles: ProjectFile[];
}

export class PanoramaProjectService {

  private getFileName(
    imagePath: string
  ): string {
    return (
      imagePath
        .replaceAll("\\", "/")
        .split("/")
        .pop() ?? ""
    );
  }

  private async traverseFolder(
    folderId: string,
    currentPath: string,
    folders: ProjectFile[],
    files: ProjectFile[]
  ): Promise<void> {

    const result =
await coreApiService
  .getFolderItemsPaged(
    folderId,
    500
  );

    const items =
      result.items ?? [];

    for (const item of items) {

      const itemPath =
        `${currentPath}/${item.name}`;

      if (
        item.type === "FOLDER"
      ) {

        folders.push({
          id: item.id,
          name: item.name,
          path: itemPath,
          type: "folder",
        });

        await this.traverseFolder(
          item.id,
          itemPath,
          folders,
          files
        );

        continue;
      }

      files.push({
        id: item.id,
        name: item.name,
        path: itemPath,
        type: "file",
      });
    }
  }

  public async discoverProjectFiles(
    projectId: string
  ) {

    const project =
      await coreApiService
        .getProject(
          projectId
        );

    const folders:
      ProjectFile[] = [];

    const files:
      ProjectFile[] = [];

    await this.traverseFolder(
      project.rootId,
      "",
      folders,
      files
    );

    return {
      folders,
      files,
    };
  }

  public async discoverCsvFiles(
    projectId: string
  ): Promise<ProjectFile[]> {

    const result =
      await this
        .discoverProjectFiles(
          projectId
        );

    return result.files
      .filter(
        file =>
          file.name
            .toLowerCase()
            .endsWith(".csv")
      )
      .map(
        file => ({
          ...file,
          type: "csv" as const,
        })
      );
  }

  public async discoverImageFiles(
    projectId: string
  ): Promise<ProjectFile[]> {

    const result =
      await this
        .discoverProjectFiles(
          projectId
        );

    return result.files
      .filter(
        file => {

          const name =
            file.name
              .toLowerCase();

          return (
            name.endsWith(
              ".jpg"
            ) ||
            name.endsWith(
              ".jpeg"
            ) ||
            name.endsWith(
              ".png"
            ) ||
            name.endsWith(
              ".tif"
            ) ||
            name.endsWith(
              ".tiff"
            )
          );
        }
      )
      .map(
        file => ({
          ...file,
          type: "image" as const,
        })
      );
  }

  public async loadPanoramaPoseFile(
    csvFileId: string
  ): Promise<
    PanoramaPose[]
  > {

    const urlResult =
      await coreApiService
        .getDownloadUrl(
          csvFileId
        );

    const file =
      await coreApiService
        .downloadFileText(
          urlResult.url
        );

    return (
      panoramaPoseParser
        .parse(
          file.text
        )
    );
  }

  public async getImageDownloadUrl(
    imageFileId: string
  ): Promise<string> {

    const result =
      await coreApiService
        .getDownloadUrl(
          imageFileId
        );

    return result.url;
  }

  public findMatchingImage(
    pose: PanoramaPose,
    imageFiles:
      ProjectFile[]
  ): ProjectFile | undefined {

    const fileName =
      this.getFileName(
        pose.imagePath
      );

    return imageFiles.find(
      image =>
        image.name
          .toLowerCase() ===
        fileName
          .toLowerCase()
    );
  }
}

export const
  panoramaProjectService =
    new PanoramaProjectService();