export class CoreApiService {
  public async getFolders(
    projectId: string
  ) {
    console.log(
      "CORE API :: GET FOLDERS",
      projectId
    );

    return [];
  }

  public async getFiles(
    projectId: string
  ) {
    console.log(
      "CORE API :: GET FILES",
      projectId
    );

    return [];
  }
}

export const coreApiService =
  new CoreApiService();