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
    <div>
      <h2>
        {props.photoName}
      </h2>

      <div>
        Image Loaded
      </div>

      <button
        disabled={
          props.selectedPhotoIndex <= 0
        }
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
        onClick={props.onClose}
      >
        Close
      </button>
    </div>
  );
}