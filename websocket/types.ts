// 

declare global {
  namespace App {
    interface Coordinates {
      lat: number;
      lng: number;
    }

    interface Message {
      origin: string,
      reason: string,
      wsConnId: number,
      type: string,
      scope: string,
      payload: {
        data: {
          coordinates: App.Coordinates
        }
      }
    }

    type SerializedMessage = (number | string | { data: { coordinates: App.Coordinates } })[];

  }
}
