import type { PhotoPose } from "../models/PhotoPose";

interface Props {
  pose?: PhotoPose;
}

export function DetailsPanel({
  pose,
}: Props) {
  if (!pose) {
    return (
      <div>
        No photo selected
      </div>
    );
  }

  return (
    <div>
      <h3>{pose.imageName}</h3>

      <p>
        <strong>X:</strong> {pose.x}
      </p>

      <p>
        <strong>Y:</strong> {pose.y}
      </p>

      <p>
        <strong>Z:</strong> {pose.z}
      </p>

      <p>
        <strong>Timestamp:</strong>{" "}
        {pose.timestamp}
      </p>
    </div>
  );
}