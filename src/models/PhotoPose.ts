export interface PhotoPose {
  timestamp: number;

  imageName: string;

  imageId?: string;

  x: number;
  y: number;
  z: number;

  yaw?: number;
  pitch?: number;
  roll?: number;
}