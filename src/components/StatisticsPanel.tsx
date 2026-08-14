import type { PhotoPose } from "../models/PhotoPose";

interface Props {
  poses: PhotoPose[];
}

export function StatisticsPanel({
  poses,
}: Props) {
  if (!poses.length) {
    return null;
  }

  const xs = poses.map((p) => p.x);
  const ys = poses.map((p) => p.y);
  const zs = poses.map((p) => p.z);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);

  return (
    <div>
      <h3>Statistics</h3>

      <p>
        <strong>Photos:</strong>{" "}
        {poses.length}
      </p>

      <p>
        <strong>X Range:</strong>
        <br />
        {minX.toFixed(3)}
        <br />
        {maxX.toFixed(3)}
      </p>

      <p>
        <strong>Y Range:</strong>
        <br />
        {minY.toFixed(3)}
        <br />
        {maxY.toFixed(3)}
      </p>

      <p>
        <strong>Elevation:</strong>
        <br />
        {minZ.toFixed(3)}
        <br />
        {maxZ.toFixed(3)}
      </p>
    </div>
  );
}