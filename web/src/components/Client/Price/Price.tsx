import * as React from 'react';
import { useIntl } from 'react-intl';

import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
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

const useFormattedPrice = ({ price, discount }: IPriceProps) => {
  const {
    intlState: { locale },
  } = useIntlState();
  const {
    ratesState: { rates },
  } = useRatesState();

  const calculatedPrice = calculateDiscountedPrice(price, discount || 0);
  const defaultFormattedPrice = React.useMemo(() => <>${calculatedPrice}</>, [calculatedPrice]);
  const formattedPrice = React.useMemo(() => {
    if (locale === 'en' || !rates.usdToKgs) {
      return defaultFormattedPrice;
    } else {
      return (
        <>
          {Math.round(calculatedPrice * rates.usdToKgs)} <u>с</u>
        </>
      );
    }
  }, [calculatedPrice, rates, locale, defaultFormattedPrice]);

  return useLazyInitialization(formattedPrice, defaultFormattedPrice).value;
};

const usePriceRange = ({ range }: IPriceRangeTextProps) => {
  const calculatedRange = range.map(price => calculateDiscountedPrice(price.price, price.discount || 0));
  const discounts = range.map(price => price.discount || 0).filter(discount => discount !== 0);

  const biggestFormattedPrice = useFormattedPrice({ price: Math.max(...calculatedRange), discount: 0 });
  const lowestFormattedPrice = useFormattedPrice({ price: Math.min(...calculatedRange), discount: 0 });

  return { calculatedRange, discounts, biggestFormattedPrice, lowestFormattedPrice };
};

export const usePriceRangeText = ({ range }: IPriceRangeTextProps) => {
  const intl = useIntl();

  const { calculatedRange, discounts, biggestFormattedPrice, lowestFormattedPrice } = usePriceRange({ range });

  const price = React.useMemo(() => {
    if (range.length === 1) {
      return <PriceCrossedText price={range[0].price} discount={range[0].discount} />;
    }

    if (calculatedRange.length > 1) {
      return (
        <>
          {lowestFormattedPrice} - {biggestFormattedPrice}
        </>
      );
    }

    return null;
  }, [lowestFormattedPrice, biggestFormattedPrice, calculatedRange, range]);

  const discount = React.useMemo(() => {
    if (range.length === 1 && discounts.length === 1) {
      return intl.formatMessage({ id: 'Price.discount' }, { value: Math.max(...discounts) });
    }
    if (range.length > 1 && discounts.length > 1) {
      return intl.formatMessage({ id: 'Price.discountUpTo' }, { value: Math.max(...discounts) });
    }
  }, [range, intl, discounts]);

  if (calculatedRange.length === 0) {
    return { price: intl.formatMessage({ id: 'common.notSpecified' }) };
  }

  return {
    price,
    discount,
  };
};

export const PriceCrossedText = ({ price, discount }: IPriceProps) => {
  const formattedPrice = useFormattedPrice({ price, discount });
  const formattedInitialPrice = useFormattedPrice({ price, discount: 0 });

  return formattedPrice !== formattedInitialPrice ? (
    <React.Fragment>
      {formattedPrice} <del>{formattedInitialPrice}</del>
    </React.Fragment>
  ) : (
    <React.Fragment>{formattedInitialPrice}</React.Fragment>
  );
};

export const PriceText = ({ price }: IPriceProps) => <>{useFormattedPrice({ price, discount: 0 })}</>;
