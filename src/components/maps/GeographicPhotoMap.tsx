import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    BasemapService,
} from "../../services/BasemapService";

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

    const initialFitDone =
        useRef(false);

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
                    "HAS PHOTO ROUTE SOURCE",
                    mapInstance.current?.getSource(
                        "photo-route"
                    )
                );

                console.log(
                    "MAP LOADED"
                );

                console.log(
                    "HAS ROUTE LAYER",
                    mapInstance.current?.getLayer(
                        "photo-route"
                    )
                );

                console.log("ADDING SOURCE");

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


                console.log(
                    "SOURCE CREATED",
                    mapInstance.current?.getSource(
                        "photo-route"
                    )
                );

                console.log("ADDING LAYER");

                mapInstance.current?.addLayer({
                    id: "photo-route",
                    type: "line",
                    source: "photo-route",
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": "#ff0000",
                        "line-width": 20,
                        "line-opacity": 1,
                    },
                });

                console.log(
                    "LAYER CREATED",
                    mapInstance.current?.getLayer(
                        "photo-route"
                    )
                );
                console.log(
                    "CURRENT STYLE",
                    mapInstance.current?.getStyle()
                );
                setMapLoaded(true);

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

        if (firstConverted) {

        }

        markersRef.current.forEach(
            marker => marker.remove()
        );

        markersRef.current = [];

        const routeCoordinates: [number, number][] = [];

        console.log(
            "BUILDING TRAJECTORY",
            photoNodes.length
        );


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

            }

            if (!converted) {
                continue;
            }
            routeCoordinates.push([
                converted[0],
                converted[1],
            ]);

            if (routeCoordinates.length <= 5) {

            }
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
                "1px solid white";


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
            mapLoaded
        ) {

            const routeSource =
                mapInstance.current?.getSource(
                    "photo-route"
                );

            console.log(
                "ROUTE SOURCE",
                routeSource
            );

            console.log(
                "ROUTE LAYER",
                mapInstance.current?.getLayer(
                    "photo-route"
                )
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
                    "FIRST ROUTE POINT",
                    routeCoordinates[0]
                );

                console.log(
                    "LAST ROUTE POINT",
                    routeCoordinates[
                    routeCoordinates.length - 1
                    ]
                );

                console.log(
                    "SHOW TRAJECTORY",
                    showTrajectory
                );

                console.log(
                    "ROUTE COORDINATES",
                    routeCoordinates.length
                );

                console.log(
                    routeCoordinates.slice(0, 5)
                );

                console.log(
                    "SHOW TRAJECTORY",
                    showTrajectory
                );

                console.log(
                    "ROUTE POINT COUNT",
                    routeCoordinates.length
                );

                console.log(
                    "SETTING ROUTE DATA",
                    routeCoordinates.length
                );

                console.log(
                    "ROUTE SOURCE TYPE",
                    routeSource?.constructor?.name
                );

                const geoJsonSource =
                    routeSource as maplibregl.GeoJSONSource;

                geoJsonSource.setData({
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
        if (
            !bounds.isEmpty() &&
            !initialFitDone.current
        ) {

            initialFitDone.current = true;

            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();

            console.log(
                "AUTO FIT SW",
                sw.lng,
                sw.lat
            );

            console.log(
                "AUTO FIT NE",
                ne.lng,
                ne.lat
            );

            console.log(
                "BOUND COUNT",
                routeCoordinates.length
            );

            mapInstance.current.fitBounds(
                bounds,
                {
                    padding: {
                        top: 20,
                        bottom: 20,
                        left: 20,
                        right: 20,
                    },
                    maxZoom: 19,
                }
            );

            console.log(
                "MAP CENTER AFTER FIT",
                mapInstance.current.getCenter()
            );

            console.log(
                "MAP ZOOM AFTER FIT",
                mapInstance.current.getZoom()
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
            !selectedPhoto ||
            !initialFitDone.current
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

        // mapInstance.current.flyTo({
        //     center: [
        //         converted[0],
        //         converted[1],
        //     ],
        //     duration: 750,
        // });

    }, [
        selectedPhoto,
        coordinateSystem,
        mapLoaded,
    ]);


//
// Change basemap
//
useEffect(() => {

    if (!mapInstance.current) {
        return;
    }

    console.log(
        "SWITCHING BASEMAP",
        basemap
    );

mapInstance.current.setStyle(
    BasemapService.getStyle(
        basemap
    ) as any
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
                                    padding: {
                                        top: 20,
                                        bottom: 20,
                                        left: 20,
                                        right: 20,
                                    },
                                    maxZoom: 19,
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