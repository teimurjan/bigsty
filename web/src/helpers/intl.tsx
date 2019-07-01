import { IIntlListResponseItem } from "src/api/IntlAPI";

export const extendIntlTextWithLocaleNames = (
  intlText: { [key: string]: string },
  availableLocales: IIntlListResponseItem[]
) =>
  Object.keys(intlText).reduce((acc, languageId) => {
    const locale = availableLocales.find(
      ({ id }) => id === parseInt(languageId, 10)
    );
    if (locale) {
      return {
        ...acc,
        [locale.name]: intlText[languageId]
      };
    }

    return acc;
  }, {});
