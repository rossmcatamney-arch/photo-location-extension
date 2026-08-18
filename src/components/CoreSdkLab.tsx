import { useState } from "react";

import * as TC from "trimble-connect-sdk";

import {
  workspaceService,
} from "../services/WorkspaceService";

export function CoreSdkLab() {
  const [output, setOutput] =
    useState("");

  const discoverImageFolders =
    async () => {
      try {
        const api =
          workspaceService.getApi();

        const token =
          await api.extension
            .requestPermission(
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

        const currentProject =
          await api.project
            .getCurrentProject();

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

        const projects =
          await (
            TC.TCPSClient as any
          ).listProjects(
            australiaServer.obj
          );

        const matchingProject =
          projects.data.find(
            (project: any) =>
              project.id ===
              currentProject.id
          );

        if (!matchingProject) {
          throw new Error(
            `Project ${currentProject.id} not found`
          );
        }

        const filesystem =
          await (
            TC.TCPSClient as any
          ).listProjectFileSystemStructure(
            matchingProject
          );

        const activeFiles =
          filesystem.data.filter(
            (item: any) =>
              item.directory ===
                false &&
              item.flag !==
                "DELETED"
          );

        const imageFiles =
          activeFiles.filter(
            (file: any) => {
              const name =
                file.name?.toLowerCase();

              return (
                name?.endsWith(
                  ".jpg"
                ) ||
                name?.endsWith(
                  ".jpeg"
                ) ||
                name?.endsWith(
                  ".png"
                ) ||
                name?.endsWith(
                  ".tif"
                ) ||
                name?.endsWith(
                  ".tiff"
                )
              );
            }
          );

        const csvFiles =
          activeFiles.filter(
            (file: any) =>
              file.name
                ?.toLowerCase()
                .endsWith(
                  ".csv"
                )
          );

        const folderMap =
          new Map<
            string,
            number
          >();

        for (const image of imageFiles) {
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

        const imageFolders =
          [...folderMap.entries()]
            .map(
              ([
                path,
                imageCount,
              ]) => ({
                path,
                imageCount,
              })
            )
            .sort(
              (
                a,
                b
              ) =>
                b.imageCount -
                a.imageCount
            );

        const report = {
          buildMarker:
            "CORE SDK LAB V24",

          currentProject: {
            id:
              currentProject.id,
            name:
              currentProject.name,
          },

          imageFolderCount:
            imageFolders.length,

          csvCount:
            csvFiles.length,

          topImageFolders:
            imageFolders.slice(
              0,
              50
            ),

          csvFiles:
            csvFiles.map(
              (file: any) => ({
                fileId:
                  file.fileId,
                name:
                  file.name,
                path:
                  file.path,
              })
            ),
        };

        console.log(
          report
        );

        setOutput(
          JSON.stringify(
            report,
            null,
            2
          )
        );
      }
      catch (
        error: any
      ) {
        console.error(
          error
        );

        setOutput(
          JSON.stringify(
            {
              buildMarker:
                "CORE SDK LAB V24",

              message:
                error?.message,

              stack:
                error?.stack,
            },
            null,
            2
          )
        );
      }
    };

  return (
    <div>
      <h2>
        CORE SDK LAB V24
      </h2>

      <button
        onClick={
          discoverImageFolders
        }
      >
        Discover Image Folders
      </button>

      <pre
        style={{
          maxHeight: 700,
          overflow: "auto",
        }}
      >
        {output}
      </pre>
    </div>
  );
}