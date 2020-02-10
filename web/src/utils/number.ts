export const isStringNumber = (s: string) => parseInt(s, 10).toString() === s;
export const isAllowedForNumberInput = (s: string) => s.length === 0 || isStringNumber(s);
