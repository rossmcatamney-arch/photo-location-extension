import { workspaceService } from "../services/WorkspaceService";

interface Props {
  photoCount: number;
  source: string;
}

export function ProjectStatusPanel({
  photoCount,
  source,
}: Props) {
  return (
    <div>
      <h2>Project Status</h2>

      <p>
        <strong>Photos Loaded:</strong>{" "}
        {photoCount}
      </p>

      <p>
        <strong>Data Source:</strong>{" "}
        {source}
      </p>

      <p>
        <strong>Workspace Connected:</strong>{" "}
        {workspaceService.getConnected()
          ? "Yes"
          : "No"}
      </p>
    </div>
  );
}