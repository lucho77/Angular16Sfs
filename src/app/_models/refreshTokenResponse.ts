import { DTOError } from "./dtoError";

export class RefreshTokenResponse {
    refreshToken:string;
    token:string;
     error: DTOError;
     tokenError:boolean;
}
