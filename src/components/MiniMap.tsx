import { Stage, Layer, Line, Circle } from "react-konva";

import type { PhotoPose } from "../models/PhotoPose";

interface Props {
  poses: PhotoPose[];

  selected?: PhotoPose;
}

export function MiniMap({
  poses,
  selected,
}: Props) {
  if (!poses.length) {
    return null;
  }

  const width = 250;
  const height = 250;
  const padding = 10;

  const minX = Math.min(
    ...poses.map((p) => p.x)
  );

  const maxX = Math.max(
    ...poses.map((p) => p.x)
  );

  const minY = Math.min(
    ...poses.map((p) => p.y)
  );

  const maxY = Math.max(
    ...poses.map((p) => p.y)
  );

  const rangeX =
    maxX - minX || 1;

  const rangeY =
    maxY - minY || 1;

  const scale = Math.min(
    (width - padding * 2) /
      rangeX,
    (height - padding * 2) /
      rangeY
  );

  const linePoints =
    poses.flatMap((p) => [
      padding +
        (p.x - minX) * scale,

      height -
        padding -
        (p.y - minY) *
          scale,
    ]);

  return (
    <Stage
      width={width}
      height={height}
    >
      <Layer>
        <Line
          points={linePoints}
          stroke="#4aa3ff"
          strokeWidth={1}
        />

        {poses.map((pose) => {
          const x =
            padding +
            (pose.x -
              minX) *
              scale;

          const y =
            height -
            padding -
            (pose.y -
              minY) *
              scale;

          const selectedPoint =
            selected?.imageName ===
            pose.imageName;

          return (
            <Circle
              key={
                pose.imageName
              }
              x={x}
              y={y}
              radius={
                selectedPoint
                  ? 4
                  : 2
              }
              fill={
                selectedPoint
                  ? "#ff3b30"
                  : "#ffffff"
              }
            />
          );
        })}
      </Layer>
    </Stage>
  );
}