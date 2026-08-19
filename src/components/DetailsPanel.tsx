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
        <h3>Photo Details</h3>

        <div>
          No photo selected
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3>
        Photo Details
      </h3>

      <div
        style={{
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 8,
          background: "#f8f8f8",
          marginBottom: 16,
          wordBreak: "break-all",
        }}
      >
        <strong>Image:</strong>
        <div>
          {pose.imageName}
        </div>
      </div>

      <div>
        <strong>X:</strong>{" "}
        {pose.x.toFixed(3)}
      </div>

      <div>
        <strong>Y:</strong>{" "}
        {pose.y.toFixed(3)}
      </div>

      <div>
        <strong>Z:</strong>{" "}
        {pose.z.toFixed(3)}
      </div>

      <div
        style={{
          marginTop: 12,
        }}
      >
        <strong>Timestamp:</strong>{" "}
        {pose.timestamp}
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 20,
          border: "1px dashed #999",
          borderRadius: 8,
          textAlign: "center",
          color: "#666",
        }}
      >
        Panorama Preview
        <br />
        (Coming Next)
      </div>
    </div>
  );
}