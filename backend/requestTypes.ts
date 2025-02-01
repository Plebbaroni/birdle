export interface Bird {
    common_name: string;
    scientific_name: string;
    order: string;
    family: string;
    genus: string;
    image_url: string;
    image_credit: string;
}

export interface BirdId extends Bird {
    id: number;
}

export interface BirdIdRequest {
    id: number;
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