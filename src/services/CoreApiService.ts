import {
  workspaceService,
} from "./WorkspaceService";

export class CoreApiService {
  private readonly baseUrl =
    "https://app32.connect.trimble.com";

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

    const url =
      `${this.baseUrl}${path}`;

    console.log(
      "REQUEST URL:",
      url
    );

    const response =
      await fetch(
        url,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            Accept:
              "application/json",
          },
        }
      );

    console.log(
      "STATUS:",
      response.status
    );

    const text =
      await response.text();

    console.log(
      "RAW RESPONSE:"
    );

    console.log(text);

    if (!response.ok) {
      throw new Error(
        `API request failed (${response.status})`
      );
    }

    try {
      return JSON.parse(text);
    }
    catch {
      return text;
    }
  }

  public async getProject(
    projectId: string
  ) {
    return this.request(
      `/tc/api/2.0/projects/${projectId}`
    );
  }

  public async getFolder(
    folderId: string
  ) {
    return this.request(
      `/tc/api/2.0/folders/${folderId}`
    );
  }

  public async getFolderItems(
    folderId: string
  ) {
    return this.request(
      `/tc/api/2.1/folders/${folderId}/items?pageSize=100&objectTypes=FILE,FOLDER`
    );
  }

  public async getFile(
    fileId: string
  ) {
    return this.request(
      `/tc/api/2.0/files/${fileId}`
    );
  }

  public async getFileVersion(
    fileId: string,
    versionId: string
  ) {
    return this.request(
      `/tc/api/2.0/files/${fileId}/versions/${versionId}`
    );
  }

  public async getFileActions(
    fileId: string
  ) {
    return this.request(
      `/tc/api/2.0/files/${fileId}?fields=_actions`
    );
  }

  public async getFileWithoutTokenThumb(
    fileId: string
  ) {
    return this.request(
      `/tc/api/2.0/files/${fileId}?tokenThumburl=false`
    );
  }

  public async getDownloadUrl(
    fileId: string
  ) {
    return this.request(
      `/tc/api/2.0/files/fs/${fileId}/downloadurl`
    );
  }

public async getFolderItemsPaged(
  folderId: string,
  pageSize = 1000
) {
  return this.request(
    `/tc/api/2.1/folders/${folderId}/items?pageSize=${pageSize}&objectTypes=FILE,FOLDER`
  );
}

public async getImageUrl(
  fileId: string
) {
  const result =
    await this.getDownloadUrl(
      fileId
    );

  return result.url;
}

  public async downloadFileText(
    downloadUrl: string
  ) {
    console.log(
      "DOWNLOAD URL:",
      downloadUrl
    );

    const response =
      await fetch(
        downloadUrl
      );

    const text =
      await response.text();

    return {
      status:
        response.status,

      contentType:
        response.headers.get(
          "content-type"
        ),

      text,
    };
  }

  public async getDataUrlResponse(
    dataUrl: string
  ) {
    const token =
      await this.getAccessToken();

    console.log(
      "DATA URL REQUEST:",
      dataUrl
    );

    const response =
      await fetch(
        dataUrl,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const contentType =
      response.headers.get(
        "content-type"
      );

    const contentLength =
      response.headers.get(
        "content-length"
      );

    const text =
      await response.text();

    return {
      status:
        response.status,

      contentType,

      contentLength,

      text,
    };
  }
}

export const coreApiService =
  new CoreApiService();