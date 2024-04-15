// 

declare global {
  namespace App {
    interface Coordinates {
      lat: number;
      lng: number;
    }

    interface Message {
      origin?: string,
      reason: string,
      id: number,
      payload?: {
        scope?: string,
        data: {
          coordinates: App.Coordinates
        }
      }
    }
  }
}
