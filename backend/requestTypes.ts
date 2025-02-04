export interface Bird {
    common_name: string;
    scientific_name: string;
    order: string;
    family: string;
    genus: string;
    image_url: string;
    image_credit: string;
    id: number;
}

export interface BirdIdRequest {
    id: number;
}

export interface GuessRequest {
    birdId: number;
    userId: string;
}

export interface UserRequest {
    userId: string;
}

export interface TypedRequest<T> extends Express.Request {
    body: T;
}
  
export interface TypedRequestQuery<T> extends Express.Request {
    query: T;
}
  
export interface TypedResponse<T> extends Express.Response {
    body: T;
}

export interface BirdBody {
    bird: Bird;
}

export enum GameState{
    ONGOING = "ONGOING",
    WON = "WON",
    LOST = "LOST"
}

export interface StateBody {
    state: GameState;
}