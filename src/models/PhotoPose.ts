export interface PhotoPose {
  timestamp: number;

  imageName: string;

  x: number;
  y: number;
  z: number;

  qx: number;
  qy: number;
  qz: number;
  qw: number;
}