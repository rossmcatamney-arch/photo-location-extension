import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Stage,
    Layer,
    Circle,
    Line,
} from "react-konva";

import type {
    PhotoNode,
} from "../../models/PhotoNode";

export interface PhotoMapProps {

    photoNodes: PhotoNode[];

    selectedPhoto:
    PhotoNode | null;

    coordinateSystem:
    string;

    onPhotoSelected: (
        photo: PhotoNode
    ) => void;

}

export function LocalPhotoMap({
    photoNodes,
    selectedPhoto,
    coordinateSystem,
    onPhotoSelected,
}: PhotoMapProps) {

    const stageRef =
        useRef<any>(null);

    const [
        scale,
        setScale,
    ] = useState(1);

    const [
        position,
        setPosition,
    ] = useState({
        x: 0,
        y: 0,
    });

    const [
        showTrajectory,
        setShowTrajectory,
    ] = useState(true);

    const [
        hoverPhoto,
        setHoverPhoto,
    ] = useState<PhotoNode | null>(
        null
    );

    if (
        photoNodes.length === 0
    ) {

        return (
            <div>
                No photo nodes loaded.
            </div>
        );

    }

    const width = 1000;
    const height = 500;

    const minX =
        Math.min(
            ...photoNodes.map(
                p => p.x
            )
        );

    const maxX =
        Math.max(
            ...photoNodes.map(
                p => p.x
            )
        );

    const minY =
        Math.min(
            ...photoNodes.map(
                p => p.y
            )
        );

    const maxY =
        Math.max(
            ...photoNodes.map(
                p => p.y
            )
        );

    const rangeX =
        maxX - minX || 1;

    const rangeY =
        maxY - minY || 1;

    const fitScale =
        Math.min(
            (width - 40) /
            rangeX,
            (height - 40) /
            rangeY
        );

    const handleWheel =
        (event: any) => {

            event.evt.preventDefault();

            const stage =
                stageRef.current;

            const oldScale =
                stage.scaleX();

            const pointer =
                stage.getPointerPosition();

            if (!pointer) {
                return;
            }

            const scaleBy = 1.1;

            const mousePointTo = {
                x:
                    (pointer.x -
                        stage.x()) /
                    oldScale,
                y:
                    (pointer.y -
                        stage.y()) /
                    oldScale,
            };

            const newScale =
                event.evt.deltaY > 0
                    ? oldScale / scaleBy
                    : oldScale * scaleBy;

            setScale(
                newScale
            );

            const newPosition = {
                x:
                    pointer.x -
                    mousePointTo.x *
                    newScale,

                y:
                    pointer.y -
                    mousePointTo.y *
                    newScale,
            };

            setPosition(
                newPosition
            );

        };

    const fitExtents = () => {

        const projectWidth =
            rangeX * fitScale;

        const projectHeight =
            rangeY * fitScale;

        const newScale =
            Math.min(
                width / (projectWidth + 40),
                height / (projectHeight + 40)
            );

        const centredX =
            width / 2 -
            (
                20 +
                projectWidth / 2
            ) * newScale;

        const centredY =
            height / 2 -
            (
                height -
                20 -
                projectHeight / 2
            ) * newScale;

        setScale(newScale);

        setPosition({
            x: centredX,
            y: centredY,
        });

    };

    useEffect(() => {

        if (!selectedPhoto) {
            return;
        }

        const photoX =
            20 +
            (selectedPhoto.x - minX) *
            fitScale;

        const photoY =
            height -
            20 -
            (selectedPhoto.y - minY) *
            fitScale;

        setPosition({
            x:
                width / 2 -
                photoX * scale,

            y:
                height / 2 -
                photoY * scale,
        });

    }, [
        selectedPhoto,
    ]);

    return (

        <div
            style={{
                border:
                    "1px solid #ccc",
                borderRadius: 8,
                overflow: "hidden",
            }}
        >

            <div
                style={{
                    padding: 10,
                    background: "#333",
                    color: "white",
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                }}
            >

                <div>

                    Stations:
                    {" "}
                    {photoNodes.length}

                    {" | "}
                    CS:
                    {" "}
                    {coordinateSystem}

                    {" | "}
                    Zoom:
                    {" "}
                    {scale.toFixed(2)}x

                    {selectedPhoto && (
                        <>
                            {" | "}
                            Station:
                            {" "}
                            {selectedPhoto.imageName}

                            {" | "}
                            X:
                            {" "}
                            {selectedPhoto.x.toFixed(3)}

                            {" | "}
                            Y:
                            {" "}
                            {selectedPhoto.y.toFixed(3)}

                            {" | "}
                            Z:
                            {" "}
                            {selectedPhoto.z.toFixed(3)}
                        </>
                    )}

                </div>

                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 12,
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showTrajectory}
                            onChange={event =>
                                setShowTrajectory(
                                    event.target.checked
                                )
                            }
                        />
                        Trajectory
                    </label>

                    <button
                        onClick={fitExtents}
                    >
                        Fit Extents
                    </button>

                </div>

            </div>

            <div
                style={{
                    position: "relative",
                    background:
                        "#f0f0f0",
                }}
            >

                <Stage
                    ref={stageRef}
                    width={width}
                    height={height}
                    draggable
                    x={position.x}
                    y={position.y}
                    scaleX={scale}
                    scaleY={scale}
                    onDragMove={e =>
                        setPosition({
                            x:
                                e.target.x(),
                            y:
                                e.target.y(),
                        })
                    }
                    onDragEnd={e =>
                        setPosition({
                            x:
                                e.target.x(),
                            y:
                                e.target.y(),
                        })
                    }
                    onWheel={
                        handleWheel
                    }
                >

                    <Layer>
                        {
    showTrajectory &&
    photoNodes.slice(1).map(
                                (photo, index) => {

                                    const previous =
                                        photoNodes[index];

                                    const x1 =
                                        20 +
                                        (previous.x - minX) *
                                        fitScale;

                                    const y1 =
                                        height -
                                        20 -
                                        (previous.y - minY) *
                                        fitScale;

                                    const x2 =
                                        20 +
                                        (photo.x - minX) *
                                        fitScale;

                                    const y2 =
                                        height -
                                        20 -
                                        (photo.y - minY) *
                                        fitScale;

                                    return (
                                        <Line
                                            key={`route-${photo.id}`}
                                            points={[
                                                x1,
                                                y1,
                                                x2,
                                                y2,
                                            ]}
                                            stroke="#4a90e2"
                                            strokeWidth={1}
                                            opacity={0.5}
                                            listening={false}
                                        />
                                    );
                                }
                            )
                        }
                        {photoNodes.map(
                            photo => {

                                const x =
                                    20 +
                                    (photo.x -
                                        minX) *
                                    fitScale;

                                const y =
                                    height -
                                    20 -
                                    (photo.y -
                                        minY) *
                                    fitScale;

                                const selected =
                                    selectedPhoto?.id ===
                                    photo.id;

                                const headingLength =
                                    selected
                                        ? 22
                                        : 12;

                                const yaw =
                                    photo.yaw ?? 0;

                                const radians =
                                    (yaw * Math.PI) / 180;

                                const headingX =
                                    x +
                                    Math.sin(radians) *
                                    headingLength;

                                const headingY =
                                    y -
                                    Math.cos(radians) *
                                    headingLength;

                                return (
                                    <React.Fragment
                                        key={photo.id}
                                    >

                                        {photo.yaw !== undefined && (
                                            <Line
                                                points={[
                                                    x,
                                                    y,
                                                    headingX,
                                                    headingY,
                                                ]}
                                                stroke={
                                                    selected
                                                        ? "#66ccff"
                                                        : "#57c84d"
                                                }
                                                strokeWidth={
                                                    selected
                                                        ? 3
                                                        : 2
                                                }
                                                lineCap="round"
                                            />
                                        )}

                                        <Circle
                                            x={x}
                                            y={y}
                                            radius={
                                                selected
                                                    ? 8
                                                    : 3
                                            }
                                            fill={
                                                selected
                                                    ? "#0066ff"
                                                    : "#ff6600"
                                            }
                                            stroke={
                                                selected
                                                    ? "white"
                                                    : undefined
                                            }
                                            strokeWidth={
                                                selected
                                                    ? 2
                                                    : 0
                                            }
                                            onClick={() =>
                                                onPhotoSelected(photo)
                                            }
                                            onMouseEnter={() =>
                                                setHoverPhoto(photo)
                                            }
                                            onMouseLeave={() =>
                                                setHoverPhoto(null)
                                            }
                                        />

                                    </React.Fragment>
                                );

                            }
                        )}

                    </Layer>

                </Stage>

                {hoverPhoto && (

                    <div
                        style={{
                            position:
                                "absolute",
                            top: 10,
                            left: 10,
                            background:
                                "white",
                            border:
                                "1px solid #ccc",
                            padding: 8,
                            borderRadius: 4,
                            fontSize: 12,
                            pointerEvents:
                                "none",
                        }}
                    >

                        <div>
                            <strong>
                                {
                                    hoverPhoto.imageName
                                }
                            </strong>
                        </div>

                        <div>
                            X:
                            {" "}
                            {
                                hoverPhoto.x
                            }
                        </div>

                        <div>
                            Y:
                            {" "}
                            {
                                hoverPhoto.y
                            }
                        </div>

                        <div>
                            Z:
                            {" "}
                            {hoverPhoto.z}
                        </div>

                        <div>
                            ID:
                            {" "}
                            {hoverPhoto.imageId}
                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}