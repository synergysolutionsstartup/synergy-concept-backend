import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";
import { AuthMapper } from "@src/modules/auth/mappers";

const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;

type CreateSuperAdminDto = AccountTypes.Dtos.CreateSuperAdminDto;

type CreateSuperAdminProps = {
  body: CreateSuperAdminDto;
  dao: any;
};

export const createSuperAdminController = async (props: CreateSuperAdminProps) => {
  try {
    const { body, dao } = props;
    const { email, password, firstName, lastName } = body;

    const existingUser = await dao.findAccountByEmail(email);
    if (existingUser) {
      throw new AppError("A user with this email already exists.", 400);
    }

    const hashResult = await common.utils.hash.hashPassword(password);
    if (hashResult.error) {
      throw new AppError("Unable to create super admin account.", 500);
    }

    const userRecord: Record<string, any> = {
      email,
      role: common.constants.userRole.superAdmin,
      password: hashResult.data,
      superAdminProfile: {
        firstName,
        lastName,
      },
      verified: true,
      isApproved: true,
      schoolId: "NA",
      refreshToken: null,
      verificationToken: null,
    };

    const account = await dao.createAccount(userRecord);
    const accountResponseDto = AuthMapper.mapAccountEntityToResponseDto(account);

    return {
      status: "success",
      message: "Super admin account created successfully.",
      data: { account: accountResponseDto },
    };
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create super admin account.", 500);
  }
};
