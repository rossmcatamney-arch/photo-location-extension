import type {
  PhotoPose,
} from "../models/PhotoPose";

import type {
  PhotoRecord,
} from "../models/PhotoRecord";

import type {
  ProjectFile,
} from "../models/ProjectFile";

import type {
  PhotoMatchingResult,
} from "../models/PhotoMatchingResult";

export class PhotoMatchingService {

  private normaliseFileName(
    fileName: string
  ): string {

    return fileName
      .replaceAll("\\", "/")
      .split("/")
      .pop()
      ?.toLowerCase() ?? "";
  }

  public matchPhotos(
    poses: PhotoPose[],
    imageFiles: ProjectFile[]
  ): PhotoMatchingResult {

    const imageMap =
      new Map<
        string,
        ProjectFile
      >();

    for (const image of imageFiles) {

      imageMap.set(
        this.normaliseFileName(
          image.name
        ),
        image
      );
    }

    const records: PhotoRecord[] =
      poses.map(
        (
          pose
        ): PhotoRecord => {

          const image =
            imageMap.get(
              this.normaliseFileName(
                pose.imageName
              )
            );

          return {
  pose,

  image,

  imageStatus:
    image
      ? "available"
      : "missing",

  imageUrl:
    image?.path,

  thumbnailUrl:
    image?.path,
};

        }
      );

    const availableImages =
      records.filter(
        record =>
          record.imageStatus ===
          "available"
      ).length;

    const missingImages =
      records.filter(
        record =>
          record.imageStatus ===
          "missing"
      ).length;

    return {
      records,
      totalPoses:
        poses.length,
      availableImages,
      missingImages,
    };
  }
}

export const photoMatchingService =
  new PhotoMatchingService();