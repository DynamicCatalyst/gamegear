export type AddressType = 'HOME' | 'WORK' | 'BILLING' | 'SHIPPING';

export interface Address {
  id?: number;
  street: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  addressType: AddressType | string;
}
