import type { PhotoNode } from "../models/PhotoNode";

interface Props {
  searchText: string;
  onSearchTextChange: (
    value: string
  ) => void;
  photoNodes: PhotoNode[];
  selectedPhotoId?: string;
  onPhotoSelected: (
    photo: PhotoNode
  ) => void;
}

export function PhotoListPanel(
  props: Props
) {
  return (
    <div>
      <h3>
        Photo Nodes
      </h3>

      <input
        placeholder="Search photos..."
        value={props.searchText}
        onChange={event =>
          props.onSearchTextChange(
            event.target.value
          )
        }
      />

      <div>
        {props.photoNodes.map(photo => (
          <div
            key={photo.id}
            onClick={() =>
              props.onPhotoSelected(photo)
            }
          >
            {photo.imageName}
          </div>
        ))}
      </div>

      <div>
        Node Count: {props.photoNodes.length}
      </div>
    </div>
  );
}