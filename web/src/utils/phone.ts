export const PHONE_REGEX = /^\+996(550|551|552|553|554|555|556|557|755|999|500|501|502|504|505|507|508|509|700|701|702|703|704|705|706|707|708|709|770|771|772|773|774|775|776|777|778|779|220|221|222|225|227)\d{6}$/;

export const parsePhoneNumber = (value: string) =>
  value
    .replace(/\)/g, '')
    .replace(/\(/g, '')
    .replace(/-/g, '')
    .replace(/ /g, '');
