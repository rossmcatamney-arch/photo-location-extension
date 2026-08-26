import proj4 from "proj4";

import {
    COORDINATE_SYSTEMS,
} from "./CoordinateSystemDatabase";

export class ProjectionService {

    static toWgs84(
        coordinateSystem: string,
        x: number,
        y: number
    ) {

const system =
    COORDINATE_SYSTEMS.find(
        s => s.code === coordinateSystem
    );

        if (!system) {
            return null;
        }

        proj4.defs(
            system.code,
            system.proj4
        );

        return proj4(
            system.code,
            "WGS84",
            [x, y]
        );
    }
}