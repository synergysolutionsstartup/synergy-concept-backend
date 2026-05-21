// MAPPER FILE
// THIS TRASFORM DATA FROM ONE LAYER TO THE SHAPE OF DATA IN ANOTHER LAYER
// FOR INSTANCE FROM ENTITY TO DTO: OR FROM DTO TO ENTITY
// DEPENDING ON THE NEEDS OF THE BUSINESS LOGIC
import { AccountTypes } from "@src/_types/_index";

type AccountEntity = AccountTypes.Entities.AccountEntity;

type AccountResponseDTO = AccountTypes.Dtos.AccountResponseDTO;

const mapAccountEntityToResponseDto = (
  user: AccountEntity
): AccountResponseDTO => {
  const {
    verificationToken,
    verificationTokenExpiresAt,
    refreshToken,
    passwordResetToken,
    passwordResetTokenExpiresAt,
    password,
    ...account
  } = user;
  return account;
};

interface  UserRole {
  superAdmin: string;
  admin: string;
  staff: string;
  student: string;
  parent: string;
}

const getAccountProfile = (
  user: AccountTypes.Entities.AccountEntity,
  userRole: UserRole
):
  | AccountTypes.Entities.SuperAdminProfileEntity
  | AccountTypes.Entities.StudentProfileEntity
  | AccountTypes.Entities.StaffProfileEntity
  | AccountTypes.Entities.ParentProfileEntity => {
  switch (user.role) {
    case userRole.superAdmin:
      return user.superAdminProfile!;
    case userRole.admin:
      return user.adminProfile!;
    case userRole.student:
      return user.studentProfile!;
    case userRole.staff:
      return user.staffProfile!;
    case userRole.parent:
      return user.parentProfile!;
    default:
      throw new Error("Invalid user role or missing profile.");
  }
};

export const AuthMapper = {
  mapAccountEntityToResponseDto,
  getAccountProfile,
};
