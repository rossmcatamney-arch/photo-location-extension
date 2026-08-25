export class BasemapService {

    static getStyle(
        basemap: string,
    ) {

        switch (basemap) {

            case "satellite":

                return {
                    version: 8 as const,
                    sources: {
                        satellite: {
                            type: "raster",
                            tiles: [
                                "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                            ],
                            tileSize: 256,
                        },
                    },
                    layers: [
                        {
                            id: "satellite",
                            type: "raster",
                            source: "satellite",
                        },
                    ],
                };

            case "street":

            default:

                return {
                    version: 8 as const,
                    sources: {
                        osm: {
                            type: "raster",
                            tiles: [
                                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            ],
                            tileSize: 256,
                        },
                    },
                    layers: [
                        {
                            id: "osm",
                            type: "raster",
                            source: "osm",
                        },
                    ],
                };

        }

    }

}