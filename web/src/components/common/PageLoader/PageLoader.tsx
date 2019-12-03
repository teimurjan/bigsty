/** @jsx jsx */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import ClipLoader from 'react-spinners/ClipLoader';
import Transition from 'react-transition-group/Transition';

import {
  alignItemsCenterMixin,
  flexMixin,
  fullHeightMixin,
  fullWidthMixin,
  justifyContentCenterMixin,
  positionAbsoluteMixin,
} from 'src/styles/mixins';
import { ITheme } from 'src/themes';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean;
  timeout?: number;
}

const getCSS = (timeout: number, shouldShow: boolean) => (theme: ITheme) => css`
  transition: transform ${timeout}ms ease-in-out;
  transform: translateY(${shouldShow ? 0 : -100}%);
  ${alignItemsCenterMixin};
  ${flexMixin};
  ${justifyContentCenterMixin};
  ${positionAbsoluteMixin};
  ${fullWidthMixin};
  ${fullHeightMixin};
  top: 0;
  z-index: 777;

  > div {
    border-width: 5px;
    border-color: ${theme.light} ${theme.light} transparent ${theme.light};
  }
`;

export const PageLoader = ({ isActive, className, timeout = 500, ...props }: IProps) =>
  ReactDOM.createPortal(
    <Transition in={isActive} timeout={timeout} unmountOnExit={true}>
      {status => {
        const shouldShow = status === 'entering' || status === 'entered';
        return (
          <div css={getCSS(timeout, shouldShow)} className={classNames(className, 'has-background-primary')} {...props}>
            <ClipLoader color="white" sizeUnit="vw" size={15} loading={true} />
          </div>
        );
      }}
    </Transition>,
    document.body,
  );
