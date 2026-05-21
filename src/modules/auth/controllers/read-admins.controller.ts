import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";
import { AuthMapper } from "@src/modules/auth/mappers";

const AppError = common.errors.AppError;

type AccountEntity = AccountTypes.Entities.AccountEntity;

interface Props {
  dao: any;
}

export const readAdminsController = async (props: Props) => {
  try {
    const { dao } = props;
    const admins = await dao.readAdminAccounts();
    const sanitizedAdmins = admins.map(AuthMapper.mapAccountEntityToResponseDto);

    return {
      status: "success",
      message: "Admins retrieved successfully.",
      data: sanitizedAdmins,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to read admin accounts.", 500);
  }
};
