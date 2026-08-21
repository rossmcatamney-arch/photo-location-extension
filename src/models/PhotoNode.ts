export interface PhotoNode {
  id: string;

  imageId: string;
  imageName: string;

  x: number;
  y: number;
  z: number;

  yaw?: number;
  pitch?: number;
  roll?: number;
}