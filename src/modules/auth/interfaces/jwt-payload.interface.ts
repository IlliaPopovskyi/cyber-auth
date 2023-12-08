import { Request } from 'express';
export interface IUserJwtPayload {
  id: number;
}

export interface IRequestWithUserJwtPayload extends Request {
  user: IUserJwtPayload;
}
