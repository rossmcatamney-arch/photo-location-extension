import { useState } from "react";

import * as TC from "trimble-connect-sdk";

import {
  workspaceService,
} from "../services/WorkspaceService";

export function CoreSdkLab() {
  const [output, setOutput] =
    useState("");

  const testDownloadApi =
    async () => {
      try {
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

        const currentProject =
          await api.project.getCurrentProject();

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

        const csvFiles =
          filesystem.data.filter(
            (file: any) =>
              file.directory === false &&
              file.flag !== "DELETED" &&
              file.name
                ?.toLowerCase()
                .endsWith(".csv")
          );

        if (csvFiles.length === 0) {
          throw new Error(
            "No CSV files found"
          );
        }

        const firstCsv =
          csvFiles[0];

        const report: any = {
          buildMarker:
            "CSV DOWNLOAD LAB V4",

          fileName:
            firstCsv.name,

          fileId:
            firstCsv.fileId,
        };

        const fileDetails =
          await (
            TC.TCPSClient as any
          ).getFile(
            matchingProject,
            firstCsv.fileId
          );

        report.fileDetails =
          fileDetails?.data;

        const downloadUrlResult =
          await (
            TC.TCPSClient as any
          ).getFileDownloadUrl(
            fileDetails.data
          );

        report.downloadUrlResult =
          downloadUrlResult;

        console.log(
          "DOWNLOAD URL RESULT",
          downloadUrlResult
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
        CSV Download Lab V4
      </h2>

      <button
        onClick={
          testDownloadApi
        }
      >
        Test Download API
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