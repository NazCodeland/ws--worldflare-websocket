export namespace Worldflare {
  export namespace App {
    // Inside the `encode` function, we use single bytes to store the "Origin", "Reason", "Type", and "Scope" enums.
    // This single byte storage approach is sufficient as long as the number of distinct members in each enum does not exceed 256.

    export enum Origin {
      Unknown, // 0
      Reserved, // 1
      Client, // 2
      Websocket, // 3
    }
    export enum Reason {
      Unknown,
      Reserved,
      UserConnected,
      UserDisconnected,
      UserGeolocation,
    }
    export enum Type {
      Unknown,
      Reserved,
      User,
      Npc,
    }
    export enum Scope {
      Unknown,
      Reserved,
      Global,
      Continent,
      Country,
      Province,
      City,
      Town,
      Area,
    }

    // In the `encode` function, we use the Float32 (32-bit floating point numbers) to store latitude and longitude values.
    // Float32 can represent numbers with up to 7 decimal digits of precision. Which, is suitable for
    // encoding latitude (ranging from -90.000000 to 90.000000) and longitude (ranging from -180.000000 to 180.000000).
    // This precision level translates to a location accuracy of approximately 11.1 centimeters.
    export interface Coordinates {
      lat: number;
      lng: number;
    }

    export interface BaseWsMessage {
      origin: Origin;
      reason: Reason;
      wsConnId: number;
      type: Type;
      scope: Scope;
      payload: {
        data: {
          coordinates: Worldflare.App.Coordinates;
        };
      };
    }
  }
}
