import {
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  isOpen: boolean;
  imageUrl: string;
  photoName: string;
  selectedPhotoIndex: number;
  totalPhotos: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function ImageViewerModal(
  props: Props
) {
  const [zoom, setZoom] =
    useState(1);

  const [position, setPosition] =
    useState({
      x: 0,
      y: 0,
    });

  const [dragging, setDragging] =
    useState(false);

  const dragStart =
    useRef({
      x: 0,
      y: 0,

    });
  useEffect(() => {

    if (!props.isOpen) {
      return;
    }

    setZoom(1);

    setPosition({
      x: 0,
      y: 0,
    });

  }, [
    props.isOpen,
    props.imageUrl,
  ]);

  useEffect(() => {

    const handleKeyDown = (
      e: KeyboardEvent
    ) => {

      if (e.key === "Escape") {
        props.onClose();
      }

      if (
        e.key === "ArrowLeft" &&
        props.selectedPhotoIndex > 0
      ) {
        props.onPrevious();
      }

      if (
        e.key === "ArrowRight" &&
        props.selectedPhotoIndex <
        props.totalPhotos - 1
      ) {
        props.onNext();
      }

    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

  }, [
    props.selectedPhotoIndex,
    props.totalPhotos,
    props.onPrevious,
    props.onNext,
    props.onClose,
  ]);

  if (!props.isOpen) {
    return null;
  }

  return (

    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          padding: 16,
          background: "#222",
          flexShrink: 0,

        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "white",
          }}
        >
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Station {props.selectedPhotoIndex + 1}
            {" of "}
            {props.totalPhotos}
          </div>

          <div
            style={{
              color: "#ccc",
              fontSize: "0.9rem",
              marginTop: 4,
            }}
          >
            {props.photoName}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >

          <button
            onClick={() =>
              setZoom(current =>
                Math.max(
                  1,
                  current - 0.25
                )
              )
            }
          >
            -
          </button>

          <div
            style={{
              color: "white",
              minWidth: 60,
              textAlign: "center",
            }}
          >
            {Math.round(zoom * 100)}%
          </div>

          <button
            onClick={() =>
              setZoom(current =>
                Math.min(
                  10,
                  current + 0.25
                )
              )
            }
          >
            +
          </button>

          <button
            onClick={() => {

              setZoom(1);

              setPosition({
                x: 0,
                y: 0,
              });

            }}
          >
            Fit
          </button>

          <button
            onClick={props.onClose}
          >
            Close
          </button>

        </div>
      </div>

      <div
        onWheel={e => {

          e.preventDefault();

          setZoom(current => {

            const next =
              e.deltaY < 0
                ? current * 1.15
                : current / 1.15;

            return Math.max(
              1,
              Math.min(next, 10)
            );

          });

        }}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {zoom === 1 && (
          <div
            style={{
              position: "absolute",
              top: 100,
              right: 20,
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "8px 12px",
              borderRadius: 6,
              zIndex: 10000,
            }}
          >
            🔍 Click image to zoom • Double-click to reset
          </div>
        )}
        <div
          style={{
            flex: 1,
            width: "100%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={props.imageUrl}
            alt={props.photoName}
            draggable={false}
            onMouseDown={e => {

              if (zoom <= 1) {
                return;
              }

              setDragging(true);

              dragStart.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y,
              };

            }}
            onMouseMove={e => {

              if (!dragging) {
                return;
              }

              const nextX =
                e.clientX - dragStart.current.x;

              const nextY =
                e.clientY - dragStart.current.y;

              const limit =
                (zoom - 1) * 500;

              setPosition({
                x: Math.max(
                  -limit,
                  Math.min(limit, nextX)
                ),
                y: Math.max(
                  -limit,
                  Math.min(limit, nextY)
                ),
              });

            }}
            onClick={() => {

              if (zoom === 1) {

                setZoom(2);

              }

            }}
            onMouseUp={() =>
              setDragging(false)
            }
            onMouseLeave={() =>
              setDragging(false)
            }
            onDoubleClick={() => {

              setZoom(1);

              setPosition({
                x: 0,
                y: 0,
              });

            }}
            style={{
              transform: `
      translate(
        ${position.x}px,
        ${position.y}px
      )
      scale(${zoom})
    `,
              transformOrigin: "center center",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              userSelect: "none",
              cursor:
                zoom <= 1
                  ? "zoom-in"
                  : dragging
                    ? "grabbing"
                    : "grab",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 16,
            width: "100%",
            background: "#222",
            flexShrink: 0,
          }}
        >
          <button
            disabled={
              props.selectedPhotoIndex <= 0
            }
            onClick={props.onPrevious}
          >
            Previous
          </button>

          <div
            style={{
              color: "white",
              minWidth: 100,
              textAlign: "center",
            }}
          >
            {props.selectedPhotoIndex + 1}
            {" / "}
            {props.totalPhotos}
          </div>

          <button
            disabled={
              props.selectedPhotoIndex >=
              props.totalPhotos - 1
            }
            onClick={props.onNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}