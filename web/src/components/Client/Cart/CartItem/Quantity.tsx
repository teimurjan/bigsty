/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
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
  const theme = useTheme<CSSTheme>();

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
          <small
            css={css`
              color: ${theme.danger};
            `}
          >
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
