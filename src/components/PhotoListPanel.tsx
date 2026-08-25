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
  Total Photos: {props.photoNodes.length}
</div>

      <div>
        Node Count: {props.photoNodes.length}
      </div>
    </div>
  );
}