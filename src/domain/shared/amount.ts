// Backend amounts are DECIMAL(15,2): the same limit for campaign goals and donations.
export const MAX_AMOUNT_DECIMALS = 2;
export const MAX_AMOUNT_INTEGER_DIGITS = 13;

export type AmountFormatIssue = "too-many-decimals" | "too-large";

// Checks the raw input text. Each form maps the issue to its own message.
export function checkAmountFormat(raw: string): AmountFormatIssue | null {
  const [integerPart = "", decimalPart = ""] = raw.split(".");
  if (decimalPart.length > MAX_AMOUNT_DECIMALS) {
    return "too-many-decimals";
  }
  if (integerPart.replace(/^0+/, "").length > MAX_AMOUNT_INTEGER_DIGITS) {
    return "too-large";
  }
  return null;
}
