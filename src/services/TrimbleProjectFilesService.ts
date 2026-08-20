import * as TC from "trimble-connect-sdk";

import {
  coreApiService,
} from "./CoreApiService";

import type {
  ProjectFile,
} from "../models/ProjectFile";

import {
  workspaceService,
} from "./WorkspaceService";

export class TrimbleProjectFilesService {

  private async getProject(
    projectId: string
  ): Promise<any> {

    const api =
      workspaceService.getApi();

    const token =
      await api.extension.requestPermission(
        "accesstoken"
      );

    const credentials =
      new (
        TC.ServiceCredentials as any
      )(
        undefined,
        token
      );

    (
      TC.TCPSClient as any
    ).config.credentials =
      credentials;

    const servers =
      await (
        TC.TCPSClient as any
      ).listServers();

    const australiaServer =
      servers.data.find(
        (server: any) =>
          server.obj?.location ===
          "australia"
      );

    if (!australiaServer) {
      throw new Error(
        "Australia server not found"
      );
    }

    const projects =
      await (
        TC.TCPSClient as any
      ).listProjects(
        australiaServer.obj
      );

    const project =
      projects.data.find(
        (item: any) =>
          item.id === projectId
      );

    if (!project) {
      throw new Error(
        `Project ${projectId} not found`
      );
    }

    return project;
  }

  private async getFilesystem(
    projectId: string
  ): Promise<any[]> {

    const project =
      await this.getProject(
        projectId
      );

    const filesystem =
      await (
        TC.TCPSClient as any
      ).listProjectFileSystemStructure(
        project
      );

    return (
      filesystem.data ?? []
    );
  }

    private mapFile(
    item: any,
    type:
      | "folder"
      | "csv"
      | "image"
      | "file"
  ): ProjectFile {

    return {
      id:
        item.fileId ??
        item.id ??
        item.name,

      name:
        item.name ??
        item.displayName ??
        "",

      path:
        item.path ??
        "",

      type,
    };
  }

  public async getProjectRoot(
    projectId: string
  ) {

    return coreApiService.getProject(
      projectId
    );
  }

  public async getFolderItems(
    folderId: string
  ) {

    return coreApiService.getFolderItems(
      folderId
    );
  }

  public async discoverFiles(
    projectId: string
  ): Promise<ProjectFile[]> {

    const filesystem =
      await this.getFilesystem(
        projectId
      );

    const activeFiles =
      filesystem.filter(
        (item: any) =>
          item.directory === false &&
          item.flag !== "DELETED"
      );

    return activeFiles.map(
      item =>
        this.mapFile(
          item,
          "file"
        )
    );
  }

public async discoverFolders(
  projectId: string
): Promise<ProjectFile[]> {

  const project =
    await coreApiService.getProject(
      projectId
    );

  const folders: ProjectFile[] = [];

  async function traverseFolder(
    folderId: string,
    currentPath: string
  ) {

    const result =
      await coreApiService.getFolderItems(
        folderId
      );

    const items =
      result.items ?? [];

    for (const item of items) {

      const path =
        currentPath
          ? `${currentPath}/${item.name}`
          : item.name;

      if (
        item.type ===
        "FOLDER"
      ) {

        folders.push({
          id:
            item.id,

          name:
            item.name,

          path,

          type:
            "folder",
        });

        if (
          item.hasChildren
        ) {

          await traverseFolder(
            item.id,
            path
          );
        }
      }
    }
  }

  await traverseFolder(
    project.rootId,
    ""
  );

  return folders;
}

  public async discoverCsvFiles(
    projectId: string
  ): Promise<ProjectFile[]> {

    const files =
      await this.discoverFiles(
        projectId
      );

    return files
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

    const files =
      await this.discoverFiles(
        projectId
      );

    return files
      .filter(
        file => {

          const name =
            file.name.toLowerCase();

          return (
            name.endsWith(".jpg") ||
            name.endsWith(".jpeg") ||
            name.endsWith(".png") ||
            name.endsWith(".tif") ||
            name.endsWith(".tiff")
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

  public async discoverImageFolders(
    projectId: string
  ): Promise<string[]> {

    const images =
      await this.discoverImageFiles(
        projectId
      );

    const folderMap =
      new Map<
        string,
        number
      >();

    for (const image of images) {

      const folder =
        image.path ?? "";

      folderMap.set(
        folder,
        (
          folderMap.get(
            folder
          ) ?? 0
        ) + 1
      );
    }

    return [...folderMap.entries()]
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .map(
        ([path]) => path
      );
  }

public async discoverImagesInFolder(
  folderId: string
): Promise<ProjectFile[]> {

  const allItems: any[] = [];

  let result =
    await coreApiService.getFolderItemsPaged(
      folderId,
      500
    );

  while (true) {

    allItems.push(
      ...(result.items ?? [])
    );

    const nextUrl =
      result.links?.next?.href;

    if (!nextUrl) {
      break;
    }

    result =
      await coreApiService.requestAbsolute(
        nextUrl
      );
  }

  return allItems
    .filter(
      (item: any) => {

        const name =
          item.name
            ?.toLowerCase() ?? "";

        return (
          item.type === "FILE" &&
          (
            name.endsWith(".jpg") ||
            name.endsWith(".jpeg") ||
            name.endsWith(".png") ||
            name.endsWith(".tif") ||
            name.endsWith(".tiff")
          )
        );
      }
    )
    .map(
      (item: any) => ({
        id: item.id,
        name: item.name,
        path: item.name,
        type: "image" as const,
      })
    );
}

  public async loadCsvContentById(
    projectId: string,
    fileId: string
  ): Promise<string> {

    const project =
      await this.getProject(
        projectId
      );

    const fileDetails =
      await (
        TC.TCPSClient as any
      ).getFile(
        project,
        fileId
      );

    const downloadUrlResult =
      await (
        TC.TCPSClient as any
      ).getFileDownloadUrl(
        fileDetails.data
      );

    const downloadUrl =
      downloadUrlResult?.data?.url;

    if (!downloadUrl) {
      throw new Error(
        "CSV download URL not found"
      );
    }

    const response =
      await fetch(
        downloadUrl
      );

    if (!response.ok) {
      throw new Error(
        `Failed to download CSV (${response.status})`
      );
    }

    return await response.text();
  }

  public async runDiscovery(
    projectId: string
  ): Promise<void> {

    const imageFolders =
      await this.discoverImageFolders(
        projectId
      );

    const csvFiles =
      await this.discoverCsvFiles(
        projectId
      );

    console.log(
      "=== PHOTO LOCATION DISCOVERY V26 ==="
    );

    console.log(
      "Image folders:",
      imageFolders.length
    );

    console.log(
      "CSV files:",
      csvFiles.length
    );
  }
}

export const trimbleProjectFilesService =
  new TrimbleProjectFilesService();