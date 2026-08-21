import * as WorkspaceAPI from "trimble-connect-workspace-api";

import {
  diagnosticsService,
} from "./DiagnosticsService";

class WorkspaceService {
  private api: any = null;

  async connect() {
    if (this.api) {
      return this.api;
    }

    console.log(
      "PHOTO LOCATION STARTING"
    );

    try {
      this.api =
        await WorkspaceAPI.connect(
          window.parent,
          (
            event: string,
            args: unknown
          ) => {
            diagnosticsService.add(
              "workspace",
              event,
              args
            );

            console.log(
              "[Workspace Event]",
              event,
              args
            );
          },
          30000
        );

      console.log(
        "Workspace connected"
      );

      console.log(
        "EXTENSION",
        this.api.extension
      );

      try {
        const host =
          await this.api.extension.getHost();

        console.log(
          "HOST",
          host
        );
      }
      catch (e) {
        console.error(
          "HOST FAILED",
          e
        );
      }
      console.log(
        "Workspace API",
        this.api
      );

      console.log(
        "Project API",
        this.api?.project
      );

      console.log(
        "Files API",
        this.api?.files
      );

      console.log(
        "Data API",
        this.api?.data
      );

      console.log(
        "ui available",
        !!this.api?.ui
      );

      console.log(
        "ATTEMPTING MENU REGISTRATION"
      );


      console.dir(
        this.api?.viewer
      );

      console.log(
        "VIEW API",
        this.api?.view
      );

      console.log(
        "VIEW KEYS",
        Object.keys(
          this.api?.view ?? {}
        )
      );

      console.log(
        "MARKUP API",
        this.api?.markup
      );

      console.log(
        "MODELSPANEL API",
        this.api?.modelsPanel
      );

      console.log(
        "EMBED API",
        this.api?.embed
      );

      console.log(
        "EXTENSION API",
        this.api?.extension
      );

      console.log(
        "MARKUP KEYS",
        Object.keys(
          this.api?.markup ?? {}
        )
      );

      console.log(
        "MODELSPANEL KEYS",
        Object.keys(
          this.api?.modelsPanel ?? {}
        )
      );

      console.log(
        "EMBED KEYS",
        Object.keys(
          this.api?.embed ?? {}
        )
      );

      console.log(
        "EXTENSION KEYS",
        Object.keys(
          this.api?.extension ?? {}
        )
      );

      console.log(
        "VIEW KEYS",
        Object.keys(
          this.api?.view ?? {}
        )
      );

      try {

        console.log(
          "ATTEMPTING MENU REGISTRATION"
        );

        if (this.api?.ui?.setMenu) {

          const result =
            await this.api.ui.setMenu({
              title: "Photo Location",
              icon:
                "https://rossmcatamney-arch.github.io/photo-location-extension/icon.png",
              command:
                "PHOTO_LOCATION_OPEN",
            });

          console.log(
            "MENU RESULT",
            result
          );

          console.log(
            "MENU REGISTERED"
          );

        }
        else {

          console.log(
            "SETMENU NOT AVAILABLE"
          );

        }

      }
      catch (menuError) {

        console.error(
          "MENU REGISTRATION FAILED",
          menuError
        );

      }

      return this.api;
    }
    catch (error) {
      console.error(
        "Workspace connection failed",
        error
      );

      throw error;
    }
  }

  getApi() {
    return this.api;
  }

  getConnected() {
    return !!this.api;
  }
}

export const workspaceService =
  new WorkspaceService();