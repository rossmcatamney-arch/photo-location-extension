import type {
  PhotoRecord,
} from "./PhotoRecord";

export interface PhotoMatchingResult {
  records: PhotoRecord[];

  totalPoses: number;

  availableImages: number;

  missingImages: number;
}