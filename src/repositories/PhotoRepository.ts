import type { PhotoPose } from "../models/PhotoPose";
import type { PhotoRecord } from "../models/PhotoRecord";

export class PhotoRepository {
  private records: PhotoRecord[] = [];

  load(poses: PhotoPose[]) {
    this.records = poses.map((pose) => ({
      pose,
      imageStatus: "unknown",
    }));
  }

  getAll(): PhotoRecord[] {
    return this.records;
  }

  count(): number {
    return this.records.length;
  }

  clear() {
    this.records = [];
  }
}