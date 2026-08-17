export interface MarkerEntry {
  id: string;

  imageName: string;

  x: number;
  y: number;
  z: number;
}

export class MarkerRegistry {
  private markers:
    MarkerEntry[] = [];

  add(
    marker: MarkerEntry
  ) {
    this.markers.push(
      marker
    );
  }

  getAll() {
    return this.markers;
  }

  clear() {
    this.markers = [];
  }
}