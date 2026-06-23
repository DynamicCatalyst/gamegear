import { Address } from './address.model';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  addressList?: Address[];
}

/** Payload for POST /users/add (registration). */
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  addressList?: Address[];
}
