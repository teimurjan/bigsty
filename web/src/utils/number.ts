export const isStringNumber = (s: string) => parseInt(s, 10).toString() === s;
export const isAllowedForNumberInput = (s: string) => s.length === 0 || isStringNumber(s);

export const calculateDiscountedPrice = (price: number, discount: number | number[]) =>
  Math.round(
    (Array.isArray(discount) ? discount : [discount]).reduce((acc, discount_) => acc - (acc * discount_) / 100, price),
  );
