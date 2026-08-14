export interface CapabilityReport {
  workspaceConnected: boolean;

  viewerApiAvailable: boolean;

  markupApiAvailable: boolean;

  projectApiAvailable: boolean;

  uiApiAvailable: boolean;

  viewerMethods: string[];

  markupMethods: string[];

  projectMethods: string[];

  uiMethods: string[];
}

export class CapabilityScanner {
  static scan(api: any): CapabilityReport {
    const methods = (
      obj: any
    ): string[] => {
      if (!obj) {
        return [];
      }

      return Object.getOwnPropertyNames(
        Object.getPrototypeOf(obj)
      );
    };

    return {
      workspaceConnected:
        !!api,

      viewerApiAvailable:
        !!api?.viewer,

      markupApiAvailable:
        !!api?.markup,

      projectApiAvailable:
        !!api?.project,

      uiApiAvailable:
        !!api?.ui,

      viewerMethods:
        methods(api?.viewer),

      markupMethods:
        methods(api?.markup),

      projectMethods:
        methods(api?.project),

      uiMethods:
        methods(api?.ui),
    };
  }
}