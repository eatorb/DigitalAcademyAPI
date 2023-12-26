import {ICredentials} from "./ICredentials";
export interface IUser extends ICredentials {
    userID: number | undefined,
    createdAt: string,
    role: string
}