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
        "setMenu available",
        !!this.api?.ui?.setMenu
      );

      try {
        if (this.api?.ui?.setMenu) {
          console.log(
            "Registering menu..."
          );

          const result =
            await this.api.ui.setMenu({
              title:
                "Photo Location",

              icon:
                "https://rossmcatamney-arch.github.io/photo-location-extension/icon.png",

              command:
                "PHOTO_LOCATION_OPEN",
            });

          console.log(
            "Menu registration result",
            result
          );
        }
      }
      catch (menuError) {
        console.error(
          "Menu registration failed",
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