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

class PanoramaPoseParser {
  public parse(
    text: string
  ): PanoramaPose[] {

    const lines =
      text
        .split("\n")
        .map(
          line => line.trim()
        )
        .filter(
          line => line.length > 0
        );

    return lines
      .filter(
        line =>
          !line.startsWith("#")
      )
      .map(
        line => {

          const parts =
            line.split(/\s+/);

          return {
            timestamp:
              Number(parts[0]),

            imagePath:
              parts[1],

            x:
              Number(parts[2]),

            y:
              Number(parts[3]),

            z:
              Number(parts[4]),

            qx:
              Number(parts[5]),

            qy:
              Number(parts[6]),

            qz:
              Number(parts[7]),

            qw:
              Number(parts[8]),
          };
        }
      );
  }
}

export const
  panoramaPoseParser =
    new PanoramaPoseParser();