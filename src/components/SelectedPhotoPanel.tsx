import type { PhotoNode } from "../models/PhotoNode";



interface Props {
    selectedPhoto: PhotoNode;
    selectedPhotoUrl: string;
    selectedPhotoIndex: number;
    totalPhotos: number;
    onPrevious: () => void;
    onNext: () => void;
    onOpenViewer: () => void;
}

export function SelectedPhotoPanel(
    props: Props
) {
    return (

        <div
            style={{
                width: 450,
            }}
        >
            <h3>Selected Photo</h3>

            <div>
                Name: {props.selectedPhoto.imageName}
            </div>

            <div>
                X: {props.selectedPhoto.x.toFixed(3)}
            </div>

            <div>
                Y: {props.selectedPhoto.y.toFixed(3)}
            </div>

            <div>
                Z: {props.selectedPhoto.z.toFixed(3)}
            </div>

            <div
                style={{
                    marginTop: 12,
                    marginBottom: 12,
                }}
            >
                {props.selectedPhotoUrl ? (
                    <img
                        src={props.selectedPhotoUrl}
                        alt={props.selectedPhoto.imageName}
                        onClick={props.onOpenViewer}
                        style={{
                            width: "100%",
                            maxHeight: 350,
                            objectFit: "contain",
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            cursor: "pointer",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            height: 300,
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        Loading image...
                    </div>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    gap: 10,
                }}
            >
                <button
                    disabled={props.selectedPhotoIndex <= 0}
                    onClick={props.onPrevious}
                >
                    Previous
                </button>

                <button
                    disabled={
                        props.selectedPhotoIndex >=
                        props.totalPhotos - 1
                    }
                    onClick={props.onNext}
                >
                    Next
                </button>

                <button
                    disabled={!props.selectedPhotoUrl}
                    onClick={props.onOpenViewer}
                >
                    Open Fullscreen
                </button>
            </div>
        </div>
    );
}