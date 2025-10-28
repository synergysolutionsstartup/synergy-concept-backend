
// ------------------ ACCOUNT ENTITY ------------------
export interface SchoolInfoEntity {
  // generated Info
  id: string;
  userId: string;

  // Basic Info
  name: string;
  photo?: string | null;

  //  contact info
  email: string;
  phoneNumber1: string;
  phoneNumber2?: string | null;

  //  Address info
  state: string;
  country: string;
  address: string;

  createdAt: Date;
  updatedAt: Date;
}
