import type { PhotoPose } from "../models/PhotoPose";

export class CsvService {
  static parse(
    content: string
  ): PhotoPose[] {
    return content
      .split("\n")
      .filter(line => line.trim().length > 0)
      .filter(
        line =>
          !line.trim().startsWith("#")
      )
      .map(line => {
        const values =
          line.trim().split(/\s+/);

        return {
          timestamp: Number(values[0]),
          imageName: values[1],

          x: Number(values[2]),
          y: Number(values[3]),
          z: Number(values[4]),

          qx: Number(values[5]),
          qy: Number(values[6]),
          qz: Number(values[7]),
          qw: Number(values[8]),
        };
      });
  }
}