/** @jsx jsx */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import SyncLoader from 'react-spinners/SyncLoader';
import Transition from 'react-transition-group/Transition';
import { useTheme } from 'emotion-theming';

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
  transition: opacity ${timeout}ms ease-in-out;
  opacity: ${shouldShow ? 1 : 0.01};
  ${alignItemsCenterMixin};
  ${flexMixin};
  ${justifyContentCenterMixin};
  ${positionAbsoluteMixin};
  ${fullWidthMixin};
  ${fullHeightMixin};
  background: rgba(200, 200, 200, 0.3);
  backdrop-filter: blur(5px);
  top: 0;
  z-index: 777;

  > div {
    border-width: 5px;
    border-color: ${theme.light} ${theme.light} transparent ${theme.light};
    z-index: 778;
  }
`;

const Loader = ({ status, timeout, className, ...props }: ILoaderProps) => {
  useModalScrollLock();
  const theme = useTheme<ITheme>();

  const shouldShow = status === 'entering' || status === 'entered';

  return (
    <div css={getCSS(timeout, shouldShow)} className={className} {...props}>
      <SyncLoader color={theme.primary} sizeUnit="px" size={20} loading={true} />
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
