import { AccountTypes } from "@src/_types/_index";
import { common } from "@src/common/_index";
import { AuthMapper } from "@src/modules/auth/mappers";

const AppError = common.errors.AppError;

type AccountEntity = AccountTypes.Entities.AccountEntity;

interface Props {
  ids: string[];
  dao: any;
}

export const approveManyAdminsController = async (props: Props) => {
  try {
    const { ids, dao } = props;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError("At least one admin id is required.", 400);
    }

    const updatedAdmins = await dao.approveManyAdmins(ids);
    const adminsResponse = updatedAdmins.map((admin: AccountEntity) =>
      AuthMapper.mapAccountEntityToResponseDto(admin)
    );

    return {
      status: "success",
      message: "Admin accounts approved successfully.",
      data: { admins: adminsResponse },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to approve admin accounts.", 500);
  }
};
