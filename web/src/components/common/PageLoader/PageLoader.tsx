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
import { useModalScrollLock } from 'src/hooks/useModalScrollLock';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean;
  timeout?: number;
}

interface ILoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  timeout: number;
  status: string;
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

const Loader = ({ status, timeout, className, ...props }: ILoaderProps) => {
  useModalScrollLock();

  const shouldShow = status === 'entering' || status === 'entered';

  return (
    <div css={getCSS(timeout, shouldShow)} className={classNames(className, 'has-background-primary')} {...props}>
      <ClipLoader color="white" sizeUnit="vw" size={15} loading={true} />
    </div>
  );
};

export const PageLoader = ({ isActive, timeout = 500, ...props }: IProps) => {
  return ReactDOM.createPortal(
    <Transition in={isActive} timeout={timeout} unmountOnExit={true}>
      {status => <Loader timeout={timeout} status={status} {...props} />}
    </Transition>,
    document.body,
  );
};
