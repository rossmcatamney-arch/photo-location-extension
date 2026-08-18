import * as TC from "trimble-connect-sdk";

import type {
  ProjectFile,
} from "../models/ProjectFile";

import {
  workspaceService,
} from "./WorkspaceService";

export class TrimbleProjectFilesService {

  private async getFilesystem(
    projectId: string
  ): Promise<any[]> {

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
        item.name ?? "",

      path:
        item.path ?? "",

      type,
    };
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

    const filesystem =
      await this.getFilesystem(
        projectId
      );

    const folders =
      filesystem.filter(
        (item: any) =>
          item.directory === true &&
          item.flag !== "DELETED"
      );

    return folders.map(
      item =>
        this.mapFile(
          item,
          "folder"
        )
    );
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
          type: "csv",
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
          type: "image",
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
    projectId: string,
    folderPath: string
  ): Promise<ProjectFile[]> {

    const images =
      await this.discoverImageFiles(
        projectId
      );

    return images.filter(
      image =>
        image.path ===
        folderPath
    );
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
      "=== PHOTO LOCATION DISCOVERY V25 ==="
    );

    console.log(
      "Image folders:",
      imageFolders.length
    );

    console.log(
      "CSV files:",
      csvFiles.length
    );

    console.log(
      imageFolders
    );

    console.log(
      csvFiles
    );
  }
}

export const trimbleProjectFilesService =
  new TrimbleProjectFilesService();