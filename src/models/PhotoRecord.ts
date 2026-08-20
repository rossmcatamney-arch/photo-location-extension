import type {
  PhotoPose,
} from "./PhotoPose";

import type {
  ProjectFile,
} from "./ProjectFile";

export interface PhotoRecord {
  pose: PhotoPose;

  image?: ProjectFile;

  imageStatus:
    | "unknown"
    | "available"
    | "missing";

  imageUrl?: string;

  thumbnailUrl?: string;
}