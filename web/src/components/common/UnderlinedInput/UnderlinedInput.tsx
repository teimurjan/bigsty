/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { useBoolean } from 'src/hooks/useBoolean';
import { ITheme } from 'src/themes';

export interface IProps {
  hasError?: boolean;
  className?: string;
  type?: string;
  placeholder: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const VERTICAL_PADDING_PX = 7.5;
const HORIZONTAL_PADDING_PX = 2.5;

export const UnderlinedInput = React.forwardRef<HTMLInputElement, IProps>(
  ({ className, hasError, placeholder, onFocus, autoFocus, ...props }, ref) => {
    const theme = useTheme<ITheme>();
    const { value: isFocused, setNegative: blur, setPositive: focus } = useBoolean();

    const onFocus_: IProps['onFocus'] = React.useCallback(
      e => {
        focus();
        onFocus && onFocus(e);
      },
      [focus, onFocus],
    );

    return (
      <div
        className={className}
        css={css`
          position: relative;
          overflow: hidden;

          &::after {
            content: '';
            background: linear-gradient(to right, ${theme.info} 50%, transparent 50%);
            transition: transform 500ms;
            transform: translateX(${isFocused ? 0 : -50}%);
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 200%;
          }
        `}
      >
        <input
          autoFocus={autoFocus}
          css={css`
            border: none;
            padding: ${VERTICAL_PADDING_PX + 10}px ${HORIZONTAL_PADDING_PX}px ${VERTICAL_PADDING_PX}px
              ${HORIZONTAL_PADDING_PX}px;
            font-size: 16px;

            &:focus {
              outline: none;
            }
          `}
          onFocus={onFocus_}
          onBlur={blur}
          ref={ref}
          className={classNames('underlined-input', { 'has-error': hasError })}
          {...props}
        />
        <span
          css={css`
            position: absolute;
            left: ${HORIZONTAL_PADDING_PX}px;
            bottom: ${VERTICAL_PADDING_PX}px;
            pointer-events: none;
            transition: all 400ms;
            font-size: ${isFocused ? 10 : 16}px;
            transform: translateY(${isFocused ? -22 : 0}px);
            color: ${isFocused ? theme.dark : theme.greyLight};

            input:not([value='']) ~ & {
              font-size: 10px;
              transform: translateY(-22px);
              color: ${theme.dark};
            }
          `}
        >
          {placeholder}
        </span>
      </div>
    );
  },
);
