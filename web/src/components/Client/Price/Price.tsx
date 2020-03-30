import * as React from 'react';
import { useIntl } from 'react-intl';

import { Tag } from 'src/components/common/Tag/Tag';
import { useIntlState } from 'src/state/IntlState';
import { useRatesState } from 'src/state/RatesState';
import { calculateDiscountedPrice } from 'src/utils/number';

interface IPriceProps {
  price: number;
  discount?: number;
}

interface IPriceRangeTextProps {
  range: IPriceProps[];
}

export const useAllPrices = (prices: IPriceProps[]) => {
  const intl = useIntl();
  const {
    ratesState: { rates },
  } = useRatesState();

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
  const {
    ratesState: { rates },
  } = useRatesState();

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
  const discounts = range.map(price => price.discount || 0).filter(discount => discount !== 0);

  const biggestFormattedPrice = useFormattedPrice({ price: Math.max(...calculatedRange), discount: 0 });
  const lowestFormattedPrice = useFormattedPrice({ price: Math.min(...calculatedRange), discount: 0 });

  if (calculatedRange.length === 0) {
    return <>{intl.formatMessage({ id: 'common.notSpecified' })}</>;
  }

  return (
    <>
      {calculatedRange.length > 1 ? `${lowestFormattedPrice} - ${biggestFormattedPrice}` : `${biggestFormattedPrice}`}
      <br />
      {range.length === 1 && discounts.length === 1 && (
        <Tag color="is-warning">{intl.formatMessage({ id: 'Price.discount' }, { value: Math.max(...discounts) })}</Tag>
      )}
      {range.length > 1 && discounts.length > 1 && (
        <Tag color="is-warning">
          {intl.formatMessage({ id: 'Price.discountUpTo' }, { value: Math.max(...discounts) })}
        </Tag>
      )}
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
