import type { PhotoPose } from "./PhotoPose";

export interface PhotoRecord {
  pose: PhotoPose;

  imageStatus:
    | "unknown"
    | "available"
    | "missing";

  imageUrl?: string;

  thumbnailUrl?: string;
}