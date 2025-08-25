export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PersonLocation {
  name?: string;
  address?: string;
  coordinates: Coordinates;
}

export interface PickupData {
  driver?: PersonLocation;
  helper?: PersonLocation;
  pickupPoint?: Coordinates;
  estimatedDistance?: number; // in meters
  estimatedDuration?: number; // in minutes
}
