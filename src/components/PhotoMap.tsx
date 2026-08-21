import { LocalPhotoMap }
  from "./maps/LocalPhotoMap";

import { GeographicPhotoMap }
  from "./maps/GeographicPhotoMap";

export function PhotoMap(props: any) {

  const geographicSystems = [

    "MGA2020_ZONE_49",
    "MGA2020_ZONE_50",
    "MGA2020_ZONE_51",
    "MGA2020_ZONE_52",
    "MGA2020_ZONE_53",
    "MGA2020_ZONE_54",
    "MGA2020_ZONE_55",
    "MGA2020_ZONE_56",

  ];

  const isGeographic =
    geographicSystems.includes(
      props.coordinateSystem
    );

  return isGeographic
    ? <GeographicPhotoMap {...props} />
    : <LocalPhotoMap {...props} />;

}