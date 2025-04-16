declare module '@rnmapbox/maps' {
  export const MapView: any;
  export const Camera: any;
  export const UserLocation: any;
  export const StyleURL: {
    Street: string;
  };
  export function setAccessToken(token: string): void;
  export function setTelemetryEnabled(enabled: boolean): void;
} 