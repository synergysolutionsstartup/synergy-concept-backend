import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";
import { authConstants } from "@src/modules/auth/constants";
import { AuthMapper } from "@src/modules/auth/mappers";

const AppError = common.errors.AppError;
const DatabaseError = common.errors.DatabaseError;

type CreateAccountDto = AccountTypes.Dtos.CreateAccountDto;

type UpdateAccountRecord = AccountTypes.Records.UpdateAccountRecord;

type AccountResponseDTO = AccountTypes.Dtos.AccountResponseDTO;

interface Props {
  body: CreateAccountDto;
  dao: any;
  requestUser: AccountResponseDTO;
}

export const createAccountController = async (props: Props) => {
  try {
    const { body, dao, requestUser } = props;
    const { role, email, password, firstName, lastName, subRoles } = body;
    const { authMessage } = authConstants;

    if (role === common.constants.userRole.admin) {
      throw new AppError("Admin accounts cannot be created here.", 400);
    }

    const existingUser = await dao.findAccountByEmail(email);
    if (existingUser) {
      throw new AppError(authMessage.userExists, 400);
    }

    const hashUtils = common.utils.hash;
    const hashedResult = await hashUtils.hashPassword(password);
    if (hashedResult.error) {
      throw new AppError(authMessage.serverError, 500);
    }

    const profilePayload: any = {
      firstName,
      lastName,
    };

    if (role === common.constants.userRole.staff) {
      profilePayload.subRoles = subRoles ?? [];
    }

    const accountPayload: Record<string, any> = {
      email,
      password: hashedResult.data,
      role,
      verified: true,
      isApproved: true,
      schoolId: requestUser.schoolId ?? "NA",
      refreshToken: null,
      verificationToken: null,
      ...(role === common.constants.userRole.student
        ? { studentProfile: profilePayload }
        : role === common.constants.userRole.staff
        ? { staffProfile: profilePayload }
        : role === common.constants.userRole.parent
        ? { parentProfile: profilePayload }
        : {}),
    };

    const account = await dao.createAccount(accountPayload);
    const accountResponseDto = AuthMapper.mapAccountEntityToResponseDto(account);

    return {
      status: "success",
      message: "Account created successfully.",
      data: { account: accountResponseDto },
    };
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AppError) {
      throw error;
    }
    throw new AppError(authConstants.authMessage.serverError, 500);
  }
};
