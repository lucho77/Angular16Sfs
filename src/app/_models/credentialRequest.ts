import { RegisterCredentialsDto } from "./registerCredentialRequest";

export interface CredentialRequest {
  username: string;
  dataSource: string;
  idUsuarioUra: number;
  webServicesAddress: string;
  modelPackage: string;
  keysDTO:RegisterCredentialsDto;
	registration:string;

}
  