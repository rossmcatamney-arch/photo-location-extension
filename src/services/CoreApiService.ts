import {
  workspaceService,
} from "./WorkspaceService";

export class CoreApiService {
  private async getAccessToken() {
    const api =
      workspaceService.getApi();

    return api.extension.requestPermission(
      "accesstoken"
    );
  }

  private async request(
    path: string
  ) {
    const token =
      await this.getAccessToken();

    console.log(
      "TOKEN LENGTH:",
      token?.length
    );

    console.log(
      "REQUEST:",
      path
    );

    const response =
      await fetch(
        `https://app31.connect.trimble.com/tc/api/2.0${path}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    console.log(
      "STATUS:",
      response.status
    );

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status}`
      );
    }

    const json =
      await response.json();

    console.log(
      "RESPONSE:"
    );

    console.log(json);

    return json;
  }

  public async getProject(
    projectId: string
  ) {
    return this.request(
      `/projects/${projectId}`
    );
  }

  public async getFolders(
    projectId: string
  ) {
    return this.request(
      `/projects/${projectId}/folders`
    );
  }

  public async getFiles(
    projectId: string
  ) {
    return this.request(
      `/projects/${projectId}/files`
    );
  }
}

export const coreApiService =
  new CoreApiService();