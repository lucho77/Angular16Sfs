export class Error {

mensaje: string;
errorBusiness: boolean;
tokenError: boolean;
tokenExpired: boolean;
errorUnknow: boolean;
opcionOne: string;
opcionTwo: string;
opcionValueOne: string;
opcionValueTwo: string;
parametroCondicional: string;

constructor(message: string, errorBusiness: boolean, tokenError: boolean, tokenExpired: boolean, errorUnknow: boolean,
    opcionOne: string, opcionTwo: string, opcionValueOne: string, opcionValueTwo: string, parametroCondicional: string) {
    this.mensaje = message;
    this.errorBusiness = errorBusiness;
    this.tokenError = tokenError;
    this.tokenExpired = tokenExpired;
    this.errorUnknow = errorUnknow;
    this.opcionOne = opcionOne;
    this.opcionTwo = opcionTwo;
    this.opcionValueOne = opcionValueOne;
    this.opcionValueTwo = opcionValueTwo;
    this.parametroCondicional = parametroCondicional;
}
}
