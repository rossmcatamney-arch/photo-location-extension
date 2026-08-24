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
    <div>
      <h3>Selected Photo</h3>

      <div>
        Name: {props.selectedPhoto.imageName}
      </div>

      <div>
        X: {props.selectedPhoto.x}
      </div>

      <div>
        Y: {props.selectedPhoto.y}
      </div>

      <div>
        Z: {props.selectedPhoto.z}
      </div>

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
    </div>
  );
}