/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { useBoolean } from 'src/hooks/useBoolean';

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
    const theme = useTheme<CSSThemeV2>();
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
            background: linear-gradient(to right, ${theme.primaryColor} 50%, black 50%);
            transition: transform 500ms;
            transform: translateX(${isFocused ? 0 : -50}%);
            position: absolute;
            bottom: 0;
            left: 0;
            height: 1px;
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
            background: transparent;
            width: 100%;

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
            font-size: 16px;
            transform: translateY(${isFocused ? -20 : 0}px) scale(${isFocused ? 0.55 : 1});
            transform-origin: 0 50%;
            color: ${isFocused ? theme.textColor : theme.textFadedColor};

            input:not([value='']) ~ & {
              transform: translateY(-20px) scale(0.55);
              color: ${theme.textColor};
            }
          `}
        >
          {placeholder}
        </span>
      </div>
    );
  },
);
