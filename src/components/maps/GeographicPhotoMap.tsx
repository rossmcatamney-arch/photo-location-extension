import {
    useEffect,
    useRef,
    useState,
} from "react";

import * as maplibregl from "maplibre-gl";

import {
    ProjectionService,
} from "../../services/ProjectionService";

export interface GeographicPhotoMapProps {

    photoNodes: any[];

    selectedPhoto: any;

    coordinateSystem: string;

    basemap: string;

    onPhotoSelected: (
        photo: any
    ) => void;

}


export function GeographicPhotoMap({

    photoNodes,

    selectedPhoto,

    coordinateSystem,

    basemap,

    onPhotoSelected,

}: GeographicPhotoMapProps) {

    console.log(
        "BASEMAP",
        basemap
    );

    const mapRef =
        useRef<HTMLDivElement>(null);

    const mapInstance =
        useRef<maplibregl.Map | null>(
            null
        );

    const markersRef =
        useRef<maplibregl.Marker[]>([]);

    const [
        showTrajectory,
        setShowTrajectory,
    ] = useState(true);

    const [
        mapLoaded,
        setMapLoaded,
    ] = useState(false);

    //
    // Create map once
    //
    useEffect(() => {

        if (
            !mapRef.current ||
            mapInstance.current
        ) {
            return;
        }

        mapInstance.current =
            new maplibregl.Map({

                container:
                    mapRef.current,

                style: {
                    version: 8,
                    sources: {
                        osm: {
                            type: "raster",
                            tiles: [
                                "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                },

                center: [
                    147.16,
                    -41.46,
                ],

                zoom: 17,

            });

        console.log(
            "MAP CREATED"
        );


        mapInstance.current.addControl(
            new maplibregl.NavigationControl()
        );



        mapInstance.current.on(
            "load",
            () => {

                console.log(
                    "MAP LOADED"
                );

                setMapLoaded(true);

                mapInstance.current?.addSource(
                    "photo-route",
                    {
                        type: "geojson",
                        data: {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "LineString",
                                coordinates: [],
                            },
                        },
                    }
                );

                mapInstance.current?.addLayer({
                    id: "photo-route",
                    type: "line",
                    source: "photo-route",
                    paint: {
                        "line-color": "#4a90e2",
                        "line-width": 2,
                        "line-opacity": 0.35,
                    },
                });

            }
        );

        mapInstance.current.on(
            "style.load",
            () => {

                console.log(
                    "STYLE LOAD SUCCESS"
                );

            }
        );

        mapInstance.current.on(
            "error",
            (e) => {

                console.error(
                    "MAP ERROR",
                    e
                );

                console.error(
                    "MAP ERROR DETAIL",
                    e
                );

            }
        );


    }, []);

    //
    // Add/update markers
    //
    useEffect(() => {

        if (
            !mapInstance.current ||
            !mapLoaded ||
            photoNodes.length === 0
        ) {
            return;
        }

        console.log(
            "COORDINATE SYSTEM",
            coordinateSystem
        );

        const first =
            photoNodes[0];

        const firstConverted =
            ProjectionService.toWgs84(
                coordinateSystem,
                first.x,
                first.y
            );

        console.log(
            "FIRST PHOTO XY",
            first.x,
            first.y
        );

        console.log(
            "FIRST PHOTO LL",
            firstConverted
        );

        if (firstConverted) {

            console.log(
                "LONGITUDE",
                firstConverted[0]
            );

            console.log(
                "LATITUDE",
                firstConverted[1]
            );

        }

        markersRef.current.forEach(
            marker => marker.remove()
        );

        markersRef.current = [];

        const routeCoordinates: [number, number][] = [];


        const bounds =
            new maplibregl.LngLatBounds();

        for (const photo of photoNodes) {

            const converted =
                ProjectionService.toWgs84(
                    coordinateSystem,
                    photo.x,
                    photo.y
                );

            if (markersRef.current.length < 5) {

                console.log(
                    "PHOTO",
                    photo.imageName
                );

                console.log(
                    "XY",
                    photo.x,
                    photo.y
                );

                console.log(
                    "WGS84",
                    converted
                );

            }

            if (!converted) {
                continue;
            }
            routeCoordinates.push([
                converted[0],
                converted[1],
            ]);
            bounds.extend([
                converted[0],
                converted[1],
            ]);

            const isSelected =
                selectedPhoto?.id === photo.id;

            const element =
                document.createElement("div");

            element.style.width =
                isSelected
                    ? "20px"
                    : "12px";

            element.style.height =
                isSelected
                    ? "20px"
                    : "12px";

            element.style.borderRadius =
                "50%";

            element.style.background =
                isSelected
                    ? "#0057d8"
                    : "#ff9000";

            element.title =
                photo.imageName;

            element.style.border =
                "3px solid white";

            element.style.cursor =
                "pointer";

            element.addEventListener(
                "click",
                () => onPhotoSelected(photo)
            );

            const marker =
                new maplibregl.Marker({
                    element,
                })
                    .setLngLat([
                        converted[0],
                        converted[1],
                    ])
                    .addTo(
                        mapInstance.current
                    );

            markersRef.current.push(
                marker
            );

        }
if (
    mapLoaded &&
    mapInstance.current?.isStyleLoaded()
) {

            const routeSource =
                mapInstance.current?.getSource(
                    "photo-route"
                );

            if (
                routeSource &&
                "setData" in routeSource
            ) {
                console.log(
                    "ROUTE SOURCE FOUND"
                );

                console.log(
                    "ROUTE POINT COUNT",
                    routeCoordinates.length
                );

                console.log(
                    "SHOW TRAJECTORY",
                    showTrajectory
                );


                (
                    routeSource as maplibregl.GeoJSONSource
                ).setData({
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates:
                            showTrajectory
                                ? routeCoordinates
                                : [],
                    },
                });

            }
        }
        if (!bounds.isEmpty()) {

            console.log(
                "AUTO FIT SW",
                bounds.getSouthWest()
            );

            console.log(
                "AUTO FIT NE",
                bounds.getNorthEast()
            );

            mapInstance.current.fitBounds(
                bounds,
                {
                    padding: 50,
                    maxZoom: 17,
                }
            );

            setTimeout(
                () => {
                    mapInstance.current?.resize();
                },
                250
            );

        }

    }, [
        photoNodes,
        coordinateSystem,
        showTrajectory,
        mapLoaded,
    ]);

    useEffect(() => {

        if (
            !mapInstance.current ||
            !mapLoaded ||
            !selectedPhoto
        ) {
            return;
        }

        const converted =
            ProjectionService.toWgs84(
                coordinateSystem,
                selectedPhoto.x,
                selectedPhoto.y
            );

        if (!converted) {
            return;
        }

        mapInstance.current.flyTo({
            center: [
                converted[0],
                converted[1],
            ],
            duration: 750,
        });

    }, [
        selectedPhoto,
        coordinateSystem,
        mapLoaded,
    ]);

    //
    // Change basemap
    //
    useEffect(() => {

        console.log(
            "SWITCHING BASEMAP",
            basemap
        );

    }, [basemap]);

    return (

        <div>

            <div
                style={{
                    padding: 10,
                    background: "#333",
                    color: "white",
                }}
            >
                Geographic Map
                {" | "}
                Stations: {photoNodes.length}
                {" | "}
                CRS: {coordinateSystem}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                }}
            >
                <label
                    style={{
                        fontSize: 12,
                    }}
                >
                    <input
                        type="checkbox"
                        checked={showTrajectory}
                        onChange={e =>
                            setShowTrajectory(
                                e.target.checked
                            )
                        }
                    />
                    {" "}
                    Trajectory
                </label>

                <button
                    onClick={() => {

                        const bounds =
                            new maplibregl.LngLatBounds();

                        for (const photo of photoNodes) {

                            const converted =
                                ProjectionService.toWgs84(
                                    coordinateSystem,
                                    photo.x,
                                    photo.y
                                );

                            if (!converted) {
                                continue;
                            }

                            bounds.extend([
                                converted[0],
                                converted[1],
                            ]);
                        }

                        if (!bounds.isEmpty()) {

                            mapInstance.current?.fitBounds(
                                bounds,
                                {
                                    padding: 50,
                                    maxZoom: 17,
                                }
                            );

                            setTimeout(
                                () => {
                                    mapInstance.current?.resize();
                                },
                                250
                            );
                        }
                    }}
                >
                    Fit Extents
                </button>
            </div>

            <div
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "600px",
                    border: "1px solid #ccc",
                }}
            />

        </div>

    );
}