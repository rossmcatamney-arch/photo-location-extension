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

    const initialBasemapLoadDone =
        useRef(false);

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

    function ensureRouteLayer(
        map: maplibregl.Map
    ) {

        if (
            !map.getSource(
                "photo-route"
            )
        ) {

            map.addSource(
                "photo-route",
                {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    },
                }
            );
        }

        if (
            !map.getLayer(
                "photo-route"
            )
        ) {

            map.addLayer({
                id: "photo-route",
                type: "line",
                source: "photo-route",
                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },
                paint: {
                    "line-color": "#00ff00",
                    "line-width": 8,
                    "line-opacity": 0.9,
                },
            });
        }
    }
    function createMarkerElement(
        isSelected: boolean,
        photo: any,
        onClick: () => void
    ) {
        const element =
            document.createElement("div");

        element.style.width =
            isSelected ? "20px" : "12px";

        element.style.height =
            isSelected ? "20px" : "12px";

        element.style.borderRadius = "50%";

        element.style.background =
            isSelected
                ? "#0057d8"
                : "#ff9000";

        element.style.border =
            "1px solid white";

        element.style.cursor =
            "pointer";

        element.title =
            photo.imageName;

        element.addEventListener(
            "click",
            onClick
        );

        return element;
    }
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
                container: mapRef.current,

                style:
                    BasemapService.getStyle(
                        basemap
                    ) as any,

                center: [0, 0],

                zoom: 1,

            });

        mapRef.current.style.visibility =
            "hidden";

        mapInstance.current.addControl(
            new maplibregl.NavigationControl()
        );



        mapInstance.current.on("load", () => {

            try {

                const map = mapInstance.current;

                if (!map) {
                    return;
                }

                ensureRouteLayer(map);

                setMapLoaded(true);

            }
            catch (error) {

                console.error(
                    "MARKER EFFECT CRASHED",
                    error
                );

            }

        });

        mapInstance.current.on(
            "style.load",
            () => {

                setMapLoaded(false);

                setTimeout(() => {

                    setMapLoaded(true);

                }, 0);

                initialFitDone.current = false;

                const map =
                    mapInstance.current;

                if (!map) {
                    return;
                }

                ensureRouteLayer(map);

            }
        );

        mapInstance.current.on(
            "error",
            (e) => {

                console.error(
                    "MAP ERROR",
                    e
                );

            }
        );


        return () => {

            markersRef.current.forEach(
                marker => marker.remove()
            );

            mapInstance.current?.remove();

            mapInstance.current = null;

        };

    }, []);

    //
    // Add/update markers
    //
    useEffect(() => {

        try {

            if (
                !mapInstance.current ||
                !mapLoaded ||
                photoNodes.length === 0
            ) {
                return;
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

                const marker =
                    new maplibregl.Marker({
                        element: createMarkerElement(
                            isSelected,
                            photo,
                            () => onPhotoSelected(photo)
                        ),
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
                mapInstance.current
            ) {

                const routeSource =
                    mapInstance.current.getSource(
                        "photo-route"
                    ) as maplibregl.GeoJSONSource | undefined;

                if (!routeSource) {
                    return;
                }

                try {
                    console.log(
                        "ROUTE COORDINATES",
                        routeCoordinates.length
                    );

                    console.log(
                        routeCoordinates.slice(0, 5)
                    );
                    routeSource.setData({
                        type: "FeatureCollection",
                        features: [
                            {
                                type: "Feature",
                                properties: {},
                                geometry: {
                                    type: "LineString",
                                    coordinates:
                                        showTrajectory
                                            ? routeCoordinates
                                            : [],
                                },
                            },
                        ],
                    });

                }
                catch (error) {

                    console.error(
                        "SETDATA FAILED",
                        error
                    );

                }

            }
            if (
                !bounds.isEmpty() &&
                !initialFitDone.current
            ) {

                initialFitDone.current = true;

                mapInstance.current?.fitBounds(
                    bounds,
                    {
                        padding: 20,
                        maxZoom: 19,
                    }
                );

                setTimeout(() => {

                    mapRef.current!.style.visibility =
                        "visible";

                }, 100);

                setTimeout(
                    () => {
                        mapInstance.current?.resize();
                    },
                    250
                );

            }

        }

        catch (error) {

            console.error(
                "MARKER EFFECT CRASHED",
                error
            );

        }

    }, [
        photoNodes,
        coordinateSystem,
        showTrajectory,
        mapLoaded,
        selectedPhoto,
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

            console.log(
                "FAILED SELECTED PHOTO CONVERSION",
                coordinateSystem,
                selectedPhoto
            );

            return;
        }

    }, [
        selectedPhoto,
        coordinateSystem,
        mapLoaded,
    ]);


    //
    // Change basemap
    //
    useEffect(() => {

        initialFitDone.current = false;

    }, [coordinateSystem]);

    useEffect(() => {

        if (!mapInstance.current) {
            return;
        }

        if (!initialBasemapLoadDone.current) {

            initialBasemapLoadDone.current = true;
            return;

        }

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

                                console.log(
                                    "FAILED CONVERSION",
                                    coordinateSystem,
                                    photo
                                );

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
                                    padding: 20,
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