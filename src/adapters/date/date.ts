// dateLib.ts
import { parseISO, isValid as isValidDate } from "date-fns";

/**
 * Parse an ISO string into a Date and check if it's valid
 */
export const parseAndValidateDate = (dateStr: string): Date | null => {
  const parsed = parseISO(dateStr);

  if (isValidDate(parsed)) {
    return parsed;
  }

  return null;
  // return isValidDate(parsed) ? parsed : null;
};
