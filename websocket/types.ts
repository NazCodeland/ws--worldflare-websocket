// 
export namespace App {
  export enum Origin {
    Websocket, // 0
    Client // 1
  }

  export enum Reason {
    UserConnected,
    UserDisconnected,
    UserGeolocation
  }

  export enum Type {
    Npc,
    User,
  }

  export enum Scope {
    Area,
    City,
    Continent,
    Country,
    Global,
    Province,
    Town,
  }

  export interface Coordinates {
    lat: number;
    lng: number;
  }

  export interface Payload {
    data: {
      coordinates: App.Coordinates
    }
  }

  export interface Message {
    origin: Origin;
    reason: Reason;
    wsConnId: number;
    type: Type;
    scope: Scope;
    payload: App.Payload
  }
}


