import { AppInfo }
  from "../config/AppInfo";

interface Props {
  photoCount: number;

  workspaceConnected: boolean;

  source: string;
}

export function StatusFooter({
  photoCount,
  workspaceConnected,
  source,
}: Props) {
  return (
    <div
      style={{
        marginTop: 20,
        padding: 10,
        borderTop: "1px solid #444",
        display: "flex",
        justifyContent:
          "space-between",
        fontSize: "0.9rem",
      }}
    >
      <div>
        {AppInfo.name}
        {" "}
        v{AppInfo.version}
      </div>

      <div>
        Photos:
        {" "}
        {photoCount}
      </div>

      <div>
        Workspace:
        {" "}
        {workspaceConnected
          ? "Connected"
          : "Disconnected"}
      </div>

      <div>
        Source:
        {" "}
        {source}
      </div>
    </div>
  );
}