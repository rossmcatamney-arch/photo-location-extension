import type { PhotoPose }
  from "../models/PhotoPose";

export interface ValidationResult {
  duplicateImages: number;

  missingCoordinates: number;

  invalidOrientation: number;
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

const invalidOrientation =
  poses.filter(
    p =>
      Number.isNaN(
        p.yaw ?? 0
      ) ||
      Number.isNaN(
        p.pitch ?? 0
      ) ||
      Number.isNaN(
        p.roll ?? 0
      )
  ).length;

    return {
      duplicateImages,
      missingCoordinates,
      invalidOrientation,
    };
  }
}