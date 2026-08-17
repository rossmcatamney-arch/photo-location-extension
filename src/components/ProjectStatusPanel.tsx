interface Props {
  photoCount: number;

  source: string;

  workspaceConnected: boolean;
}

export function ProjectStatusPanel({
  photoCount,
  source,
  workspaceConnected,
}: Props) {
  return (
    <div>
      <h3>Project Status</h3>

      <p>
        <strong>Photo Count:</strong>
        {" "}
        {photoCount}
      </p>

      <p>
        <strong>Data Source:</strong>
        {" "}
        {source}
      </p>

      <p>
        <strong>Workspace:</strong>
        {" "}
        {workspaceConnected
          ? "Connected"
          : "Disconnected"}
      </p>
    </div>
  );
}