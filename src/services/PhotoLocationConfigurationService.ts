import type {
  PhotoLocationConfiguration,
} from "../models/PhotoLocationConfiguration";

export class PhotoLocationConfigurationService {
  private static readonly PREFIX =
    "photo-location";

  public save(
    configuration:
      PhotoLocationConfiguration
  ): void {
    localStorage.setItem(
      this.getStorageKey(
        configuration.projectId
      ),
      JSON.stringify(
        configuration
      )
    );
  }

  public load(
    projectId: string
  ):
    | PhotoLocationConfiguration
    | null {
    const raw =
      localStorage.getItem(
        this.getStorageKey(
          projectId
        )
      );

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(
        raw
      ) as PhotoLocationConfiguration;
    }
    catch {
      return null;
    }
  }

  private getStorageKey(
    projectId: string
  ): string {
    return `${PhotoLocationConfigurationService.PREFIX}-${projectId}`;
  }
}

export const photoLocationConfigurationService =
  new PhotoLocationConfigurationService();