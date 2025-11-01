export const SessionUtils = (dateAdapter: Record<any, any>) => {
  const parseAndValidateDate = dateAdapter.parseAndValidateDate;

  const pad = (n: number) => n.toString().padStart(2, "0");

  const validateSessionDates = (
    startDate: string,
    endDate: string
  ):
    | { isValid: false; error: string }
    | { isValid: true; startDate: Date; endDate: Date } => {

    const regexFullDate = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    if (!regexFullDate.test(startDate) || !regexFullDate.test(endDate)) {
      return { isValid: false, error: "Dates must include year, month, and day" };
    }

    const [startYear, startMonth, startDay] = startDate.split("-").map(Number) as [number, number, number];
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number) as [number, number, number];

    // Construct UTC-safe ISO string
    const parsedStart = parseAndValidateDate(`${startYear}-${pad(startMonth)}-${pad(startDay)}`);
    const parsedEnd = parseAndValidateDate(`${endYear}-${pad(endMonth)}-${pad(endDay)}`);

    if (!parsedStart || !parsedEnd) {
      return { isValid: false, error: "Invalid date format" };
    }

    if (parsedStart >= parsedEnd) {
      return { isValid: false, error: "Start date must be earlier than end date" };
    }

    return { isValid: true, startDate: parsedStart, endDate: parsedEnd };
  };

  const validateDate = (
    dateStr?: string
  ): { isValid: boolean; date: Date | null; error: string | null } => {

    if (!dateStr) return { isValid: false, date: null, error: "Date is required" };

    const regexFullDate = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFullDate.test(dateStr)) {
      return { isValid: false, date: null, error: "Date must include year, month, and day" };
    }

    const [year, month, day] = dateStr.split("-").map(Number) as [number, number, number];
    const parsed = parseAndValidateDate(`${year}-${pad(month)}-${pad(day)}`);

    if (!parsed) return { isValid: false, date: null, error: "Invalid date format" };

    return { isValid: true, date: parsed, error: null };
  };

  return { validateSessionDates, validateDate };
};
