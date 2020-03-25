import * as React from 'react';

import { useIntl } from 'react-intl';
import axios from 'axios';

import { calculateDiscountedPrice } from 'src/utils/number';
import { useIntlState } from 'src/state/IntlState';

interface IPriceProps {
  price: number;
  discount?: number;
}

interface IPriceRangeTextProps {
  range: IPriceProps[];
}

const nodeValueToFloat = (node: Element) => parseFloat(node.textContent ? node.textContent.replace(',', '.') : '');

const getValuteNode = (valuteNodes: Element[], code: string) =>
  valuteNodes.find(valute => {
    const charCode = valute.querySelector('CharCode');
    return charCode ? charCode.textContent === code : false;
  });

const getExchangeRate = (valuteNode: Element | undefined) => {
  if (valuteNode) {
    const valuteValueNode = valuteNode.querySelector('Value');
    const valuteNominalNode = valuteNode.querySelector('Nominal');
    if (valuteValueNode && valuteValueNode.textContent && valuteNominalNode && valuteNominalNode.textContent) {
      const rate = nodeValueToFloat(valuteValueNode) / nodeValueToFloat(valuteNominalNode);
      return Number.isNaN(rate) ? undefined : rate;
    }
  }

  return undefined;
};

interface IRates {
  usdToKgs?: number;
}
const rates: IRates = {};
axios.get('https://cors-anywhere.herokuapp.com/http://www.cbr.ru/scripts/XML_daily.asp').then(res => {
  const xml = new DOMParser().parseFromString(res.data, 'application/xml');
  const valutes = Array.from(xml.querySelectorAll('Valute'));
  const kgsValute = getValuteNode(valutes, 'KGS');
  const usdValute = getValuteNode(valutes, 'USD');
  const rubToKgsRate = getExchangeRate(kgsValute);
  const rubToUsdRate = getExchangeRate(usdValute);
  if (rubToUsdRate && rubToKgsRate) {
    const delta = 5;
    rates.usdToKgs = rubToUsdRate / rubToKgsRate + delta;
  }
});

export const useAllPrices = (prices: IPriceProps[]) => {
  const intl = useIntl();

  return prices.map(({ price, discount }) => {
    const calculatedPrice = calculateDiscountedPrice(price, discount || 0);
    if (intl.locale === 'en-US' || !rates.usdToKgs) {
      return { price: calculatedPrice, currency: 'USD' };
    } else {
      return { price: Math.round(calculatedPrice * rates.usdToKgs), currency: 'KGS' };
    }
  });
};

const useFormattedPrice = ({ price, discount }: IPriceProps) => {
  const {
    intlState: { locale },
  } = useIntlState();

  const calculatedPrice = calculateDiscountedPrice(price, discount || 0);
  if (locale === 'en-US' || !rates.usdToKgs) {
    return `$${calculatedPrice}`;
  } else {
    return `${Math.round(calculatedPrice * rates.usdToKgs)} сом`;
  }
};

export const PriceRangeText = ({ range }: IPriceRangeTextProps) => {
  const intl = useIntl();

  const calculatedRange = range.map(price => calculateDiscountedPrice(price.price, price.discount || 0));

  const biggestFormattedPrice = useFormattedPrice({ price: Math.max(...calculatedRange), discount: 0 });
  const lowestFormattedPrice = useFormattedPrice({ price: Math.min(...calculatedRange), discount: 0 });

  if (calculatedRange.length === 0) {
    return <>{intl.formatMessage({ id: 'common.notSpecified' })}</>;
  }

  return (
    <>
      {calculatedRange.length > 1 ? `${lowestFormattedPrice} - ${biggestFormattedPrice}` : `${biggestFormattedPrice}`}
    </>
  );
};

export const PriceCrossedText = ({ price, discount }: IPriceProps) => {
  const formattedPrice = useFormattedPrice({ price, discount });
  const formattedInitialPrice = useFormattedPrice({ price, discount: 0 });

  return formattedPrice !== formattedInitialPrice ? (
    <React.Fragment>
      <del>{formattedInitialPrice}</del> {formattedPrice}
    </React.Fragment>
  ) : (
    <React.Fragment>{formattedInitialPrice}</React.Fragment>
  );
};

export const PriceText = ({ price }: IPriceProps) => <>{useFormattedPrice({ price, discount: 0 })}</>;
