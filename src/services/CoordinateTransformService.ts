import type { PhotoPose } from "../models/PhotoPose";

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export class CoordinateTransformService {
  static getBounds(
    poses: PhotoPose[]
  ): Bounds {
    const xs = poses.map((p) => p.x);
    const ys = poses.map((p) => p.y);

    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),

      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }
}