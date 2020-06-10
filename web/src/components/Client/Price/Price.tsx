import * as React from 'react';
import { useIntl } from 'react-intl';

import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { useIntlState } from 'src/state/IntlState';
import { useRatesState, fixedRateDateStr } from 'src/state/RatesState';
import { USE_CEILED_PRICE } from 'src/utils/featureFlags';
import { calculateDiscountedPrice } from 'src/utils/number';
import { getRatesDateKey } from 'src/utils/rates';

interface IPriceProps {
  price: number;
  discount?: number | number[];
  date?: string;
  forceLocale?: string;
}

interface IPriceRangeTextProps {
  range: IPriceProps[];
}

const useFormattedPrice = ({ price, discount, date, forceLocale }: IPriceProps) => {
  const {
    intlState: { locale },
  } = useIntlState();
  const {
    ratesState: { rates, fetchRates, error },
  } = useRatesState();

  const ratesOnDay = rates[fixedRateDateStr ? fixedRateDateStr : getRatesDateKey(date)];
  React.useEffect(() => {
    if (!ratesOnDay) {
      fetchRates(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!ratesOnDay]);

  const calculatedPrice = calculateDiscountedPrice(price, discount || 0);
  const defaultFormattedPrice = React.useMemo(() => <>${calculatedPrice}</>, [calculatedPrice]);
  const isEn = [locale, forceLocale].some(l => l === 'en');
  const formattedPrice = React.useMemo(() => {
    const kgsToUsdRate = ratesOnDay ? ratesOnDay.kgsToUsd : undefined;
    if (!kgsToUsdRate) {
      return error ? defaultFormattedPrice : null;
    }

    const ratedPrice = Math.round(calculatedPrice * kgsToUsdRate);
    const ceiledPrice = Math.ceil(ratedPrice / 100) * 100;

    return (
      <>
        {USE_CEILED_PRICE ? ceiledPrice : ratedPrice} {isEn ? 'KGS' : <u>с</u>}
      </>
    );
  }, [calculatedPrice, ratesOnDay, isEn, defaultFormattedPrice, error]);

  return useLazyInitialization(formattedPrice, null).value;
};

const usePriceRange = ({ range }: IPriceRangeTextProps) => {
  const calculatedRange = range.map(price => calculateDiscountedPrice(price.price, price.discount || 0));
  const discounts = range
    .map(price => {
      return Array.isArray(price.discount) ? Math.max(...price.discount) : price.discount || 0;
    })
    .filter(discount => discount !== 0);

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

export const PriceCrossedText = ({ price, discount, date, forceLocale }: IPriceProps) => {
  const formattedPrice = useFormattedPrice({ price, discount, date, forceLocale });
  const formattedInitialPrice = useFormattedPrice({ price, discount: 0, date });

  const hasDiscount = Array.isArray(discount) ? discount.reduce((acc, d) => acc + d, 0) > 0 : discount && discount > 0;

  return hasDiscount ? (
    <React.Fragment>
      {formattedPrice} <del>{formattedInitialPrice}</del>
    </React.Fragment>
  ) : (
    <React.Fragment>{formattedInitialPrice}</React.Fragment>
  );
};

export const PriceText = ({ price, date, forceLocale }: IPriceProps) => (
  <>{useFormattedPrice({ price, discount: 0, date, forceLocale })}</>
);
