export interface CoordinateSystem {
    code: string;
    name: string;
    epsg?: string;
    proj4: string;
}

export const COORDINATE_SYSTEMS: CoordinateSystem[] = [
    {
        code: "MGA2020_ZONE_49",
        name: "MGA2020 Zone 49",
        epsg: "EPSG:7849",
        proj4:
            "+proj=utm +zone=49 +south +datum=GDA2020 +units=m +no_defs",
    },
    {
        code: "MGA2020_ZONE_50",
        name: "MGA2020 Zone 50",
        epsg: "EPSG:7850",
        proj4:
            "+proj=utm +zone=50 +south +datum=GDA2020 +units=m +no_defs",
    },
    {
        code: "MGA2020_ZONE_51",
        name: "MGA2020 Zone 51",
        epsg: "EPSG:7851",
        proj4:
            "+proj=utm +zone=51 +south +datum=GDA2020 +units=m +no_defs",
    },
    {
        code: "MGA2020_ZONE_52",
        name: "MGA2020 Zone 52",
        epsg: "EPSG:7852",
        proj4:
            "+proj=utm +zone=52 +south +datum=GDA2020 +units=m +no_defs",
    },
    {
        code: "MGA2020_ZONE_53",
        name: "MGA2020 Zone 53",
        epsg: "EPSG:7853",
        proj4:
            "+proj=utm +zone=53 +south +datum=GDA2020 +units=m +no_defs",
    },
    {
        code: "MGA2020_ZONE_54",
        name: "MGA2020 Zone 54",
        epsg: "EPSG:7854",
        proj4:
            "+proj=utm +zone=54 +south +datum=GDA2020 +units=m +no_defs",
    },
    {
        code: "MGA2020_ZONE_55",
        name: "MGA2020 Zone 55",
        epsg: "EPSG:7855",
        proj4:
            "+proj=utm +zone=55 +south +datum=GDA2020 +units=m +no_defs",
    },
    {
        code: "MGA2020_ZONE_56",
        name: "MGA2020 Zone 56",
        epsg: "EPSG:7856",
        proj4:
            "+proj=utm +zone=56 +south +datum=GDA2020 +units=m +no_defs",
    },
];