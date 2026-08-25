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
          padding: 20,
          marginTop: 40,
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

        <button onClick={props.onClose}>
          Close
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <img
          src={props.imageUrl}
          alt={props.photoName}
          style={{
            maxWidth: "95%",
            maxHeight: "85%",
            objectFit: "contain",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 12,
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