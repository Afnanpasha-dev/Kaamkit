export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  totalWeeks: number;
  totalHours: number;
  nextBirthdayDate: Date;
  daysUntilNextBirthday: number;
  dayOfWeekBorn: string;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Timezone-safe parsing of YYYY-MM-DD strings to local midnight Date objects.
 */
export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD.");
  }
  const [y, m, d] = parts;
  const date = new Date(y, m - 1, d, 0, 0, 0, 0);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    throw new Error("Invalid calendar date.");
  }
  return date;
}

/**
 * Checks if a given year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Formats a Date object as YYYY-MM-DD string in local time.
 */
export function formatLocalDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Calculates exact age, total days, and next birthday metrics.
 */
export function calculateAge(dobStr: string, calculateOnStr: string): AgeResult {
  const birthDate = parseLocalDate(dobStr);
  const targetDate = parseLocalDate(calculateOnStr);

  const diffTime = targetDate.getTime() - birthDate.getTime();
  if (diffTime < 0) {
    throw new Error("Date of birth cannot be after the calculate-on date.");
  }

  // 1. Calculate Exact Age (Years, Months, Days)
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    // Get total days in the month prior to targetDate
    const prevMonthDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += prevMonthDate.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // 2. Calculate Total Days (timezone-safe midnight diff)
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalMonths = years * 12 + months;
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // 3. Day of week born
  const dayOfWeekBorn = DAYS_OF_WEEK[birthDate.getDay()];

  // 4. Calculate Next Birthday
  let nextBirthdayYear = targetDate.getFullYear();
  let birthMonth = birthDate.getMonth();
  let birthDay = birthDate.getDate();

  // If born Feb 29 and target year is not leap, adjust to Feb 28
  if (birthMonth === 1 && birthDay === 29 && !isLeapYear(nextBirthdayYear)) {
    birthDay = 28;
  }

  let nextBirthday = new Date(nextBirthdayYear, birthMonth, birthDay, 0, 0, 0, 0);

  // If nextBirthday is earlier than targetDate today, move to next year
  if (nextBirthday.getTime() < targetDate.getTime()) {
    nextBirthdayYear += 1;
    let targetBirthDay = birthDate.getDate();
    if (birthMonth === 1 && targetBirthDay === 29 && !isLeapYear(nextBirthdayYear)) {
      targetBirthDay = 28;
    }
    nextBirthday = new Date(nextBirthdayYear, birthMonth, targetBirthDay, 0, 0, 0, 0);
  }

  const daysUntilNextBirthday = Math.round(
    (nextBirthday.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    years,
    months,
    days,
    totalDays,
    totalMonths,
    totalWeeks,
    totalHours,
    nextBirthdayDate: nextBirthday,
    daysUntilNextBirthday,
    dayOfWeekBorn,
  };
}
