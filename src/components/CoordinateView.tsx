import { useState } from "react";
import {
  Stage,
  Layer,
  Circle,
  Line,
  Group,
} from "react-konva";

import type { PhotoPose } from "../models/PhotoPose";

interface Props {
  poses: PhotoPose[];
  selected?: PhotoPose;

  onSelect: (
    pose: PhotoPose
  ) => void;
}

export function CoordinateView({
  poses,
  selected,
  onSelect,
}: Props) {
  const [scale, setScale] =
    useState(1);

  const [position, setPosition] =
    useState({
      x: 0,
      y: 0,
    });

  if (!poses.length) {
    return null;
  }

  const width = 900;
  const height = 700;
  const padding = 40;

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

  const fittedScale =
    Math.min(
      (width - padding * 2) /
        rangeX,
      (height - padding * 2) /
        rangeY
    );

  const linePoints =
    poses.flatMap((p) => [
      padding +
        (p.x - minX) *
          fittedScale,

      height -
        padding -
        (p.y - minY) *
          fittedScale,
    ]);

  const handleWheel = (
    e: any
  ) => {
    e.evt.preventDefault();

    const stage =
      e.target.getStage();

    if (!stage) {
      return;
    }

    const pointer =
      stage.getPointerPosition();

    if (!pointer) {
      return;
    }

    const scaleBy = 1.1;

    const oldScale = scale;

    const mousePointTo = {
      x:
        (pointer.x -
          position.x) /
        oldScale,

      y:
        (pointer.y -
          position.y) /
        oldScale,
    };

    const newScale =
      e.evt.deltaY < 0
        ? oldScale * scaleBy
        : oldScale / scaleBy;

    const clampedScale =
      Math.max(
        0.2,
        Math.min(
          20,
          newScale
        )
      );

    setScale(clampedScale);

    setPosition({
      x:
        pointer.x -
        mousePointTo.x *
          clampedScale,

      y:
        pointer.y -
        mousePointTo.y *
          clampedScale,
    });
  };

  return (
    <Stage
      width={width}
      height={height}
      onWheel={handleWheel}
      style={{
        border:
          "1px solid #333",
        background:
          "#0f172a",
      }}
    >
      <Layer>
        <Group
          x={position.x}
          y={position.y}
          scaleX={scale}
          scaleY={scale}
          draggable
          onDragEnd={(e) => {
            setPosition({
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        >
          <Line
            points={linePoints}
            stroke="#4aa3ff"
            strokeWidth={2}
          />

          {poses.map((pose) => {
            const x =
              padding +
              (pose.x -
                minX) *
                fittedScale;

            const y =
              height -
              padding -
              (pose.y -
                minY) *
                fittedScale;

            const isSelected =
              selected
                ?.imageName ===
              pose.imageName;

            return (
              <Circle
                key={
                  pose.imageName
                }
                x={x}
                y={y}
                radius={
                  isSelected
                    ? 8
                    : 4
                }
                fill={
                  isSelected
                    ? "#ff3b30"
                    : "#ffffff"
                }
                stroke="#000000"
                strokeWidth={1}
                onClick={() =>
                  onSelect(
                    pose
                  )
                }
                onMouseEnter={() => {
                  document.body.style.cursor =
                    "pointer";
                }}
                onMouseLeave={() => {
                  document.body.style.cursor =
                    "default";
                }}
              />
            );
          })}
        </Group>
      </Layer>
    </Stage>
  );
}