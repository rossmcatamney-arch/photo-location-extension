import proj4 from "proj4";

export class ProjectionService {

  static toWgs84(
    coordinateSystem: string,
    x: number,
    y: number
  ) {

    const definitions: Record<string, string> = {

      MGA2020_ZONE_49:
        "+proj=utm +zone=49 +south +datum=GDA2020 +units=m +no_defs",

      MGA2020_ZONE_50:
        "+proj=utm +zone=50 +south +datum=GDA2020 +units=m +no_defs",

      MGA2020_ZONE_51:
        "+proj=utm +zone=51 +south +datum=GDA2020 +units=m +no_defs",

      MGA2020_ZONE_52:
        "+proj=utm +zone=52 +south +datum=GDA2020 +units=m +no_defs",

      MGA2020_ZONE_53:
        "+proj=utm +zone=53 +south +datum=GDA2020 +units=m +no_defs",

      MGA2020_ZONE_54:
        "+proj=utm +zone=54 +south +datum=GDA2020 +units=m +no_defs",

      MGA2020_ZONE_55:
        "+proj=utm +zone=55 +south +datum=GDA2020 +units=m +no_defs",

      MGA2020_ZONE_56:
        "+proj=utm +zone=56 +south +datum=GDA2020 +units=m +no_defs",

    };

    const definition =
      definitions[coordinateSystem];

    if (!definition) {
      return null;
    }

    proj4.defs(
      coordinateSystem,
      definition
    );

    return proj4(
      coordinateSystem,
      "WGS84",
      [x, y]
    );

  }

}