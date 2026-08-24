import type { PhotoNode } from "../models/PhotoNode";

import {
  PhotoMap,
} from "./PhotoMap";

interface Props {
  basemap: string;
  onBasemapChange: (
    value: string
  ) => void;
  photoNodes: PhotoNode[];
  selectedPhoto: PhotoNode | null;
  coordinateSystem: string;
  onPhotoSelected: (
    photo: PhotoNode
  ) => void;
}

export function PhotoMapPanel(
  props: Props
) {
  return (
    <div>
      <div>
        <strong>
          Basemap
        </strong>

        <div>
          <select
            value={props.basemap}
            onChange={event =>
              props.onBasemapChange(
                event.target.value
              )
            }
          >
            <option value="none">
              None
            </option>

            <option value="street">
              Street
            </option>

            <option value="satellite">
              Satellite
            </option>
          </select>
        </div>
      </div>

      <PhotoMap
        photoNodes={props.photoNodes}
        selectedPhoto={props.selectedPhoto}
        coordinateSystem={
          props.coordinateSystem
        }
        basemap={props.basemap}
        onPhotoSelected={
          props.onPhotoSelected
        }
      />
    </div>
  );
}
