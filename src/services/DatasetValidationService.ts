import type { PhotoPose }
  from "../models/PhotoPose";

export interface ValidationResult {
  duplicateImages: number;

  missingCoordinates: number;

  invalidQuaternions: number;
}

export class DatasetValidationService {
  static validate(
    poses: PhotoPose[]
  ): ValidationResult {

    const duplicateImages =
      poses.length -
      new Set(
        poses.map(
          p => p.imageName
        )
      ).size;

    const missingCoordinates =
      poses.filter(
        p =>
          Number.isNaN(p.x) ||
          Number.isNaN(p.y) ||
          Number.isNaN(p.z)
      ).length;

    const invalidQuaternions =
      poses.filter(
        p =>
          Number.isNaN(p.qx) ||
          Number.isNaN(p.qy) ||
          Number.isNaN(p.qz) ||
          Number.isNaN(p.qw)
      ).length;

    return {
      duplicateImages,
      missingCoordinates,
      invalidQuaternions,
    };
  }
}