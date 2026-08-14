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