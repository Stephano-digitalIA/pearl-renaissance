export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postalAddress: Address;
  shippingAddress: Address;
  usePostalAsShipping: boolean;
}

export const emptyAddress: Address = {
  street: '',
  city: '',
  postalCode: '',
  country: '',
  countryCode: '',
};

export const emptyProfile: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  postalAddress: { ...emptyAddress },
  shippingAddress: { ...emptyAddress },
  usePostalAsShipping: true,
};
