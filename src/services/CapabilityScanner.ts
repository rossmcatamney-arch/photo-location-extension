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
  private static getMembers(
    obj: any
  ): string[] {
    if (!obj) {
      return [];
    }

    const members = new Set<string>();

    let current = obj;

    while (
      current &&
      current !== Object.prototype
    ) {
      Object.getOwnPropertyNames(
        current
      ).forEach((name) =>
        members.add(name)
      );

      current =
        Object.getPrototypeOf(
          current
        );
    }

    return Array.from(
      members
    ).sort();
  }

  static scan(
    api: any
  ): CapabilityReport {
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
        this.getMembers(
          api?.viewer
        ),

      markupMethods:
        this.getMembers(
          api?.markup
        ),

      projectMethods:
        this.getMembers(
          api?.project
        ),

      uiMethods:
        this.getMembers(
          api?.ui
        ),
    };
  }
}