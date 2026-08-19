export interface PanoramaPose {
  timestamp: number;

  imagePath: string;

  x: number;
  y: number;
  z: number;

  qx: number;
  qy: number;
  qz: number;
  qw: number;
}