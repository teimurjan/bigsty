/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { useIntl } from 'react-intl';

import { Button } from 'src/components/common/Button/Button';
import { preventDefault } from 'src/utils/dom';

interface IProps {
  count: number;
  allowedCount: number;
  onAddClick: () => void;
  onRemoveClick: () => void;
}

export const Quantity = ({ count, allowedCount, onAddClick, onRemoveClick }: IProps) => {
  const intl = useIntl();

  return (
    <div
      css={css`
        padding-top: 1rem;
        display: flex;
        justify-content: space-between;
      `}
    >
      <div>
        {intl.formatMessage({ id: 'common.quantity' })}: {count}
        {count > allowedCount && (
          <small className="has-text-danger">
            <br />
            {intl.formatMessage({ id: 'Cart.onlySomeAvailable' }, { quantity: allowedCount })}
          </small>
        )}
      </div>
      <div>
        <Button onClick={preventDefault(onRemoveClick)}>{intl.formatMessage({ id: 'common.remove' })}</Button>
        <Button onClick={preventDefault(onAddClick)}>{intl.formatMessage({ id: 'common.add' })}</Button>
      </div>
    </div>
  );
};
