/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { NProgress } from '@tanem/react-nprogress';
import { useTheme } from 'emotion-theming';

import { useRouteChangeStatus, Status } from 'src/hooks/useRouteChangeStatus';

export const PageProgressBar = () => {
  const theme = useTheme<CSSThemeV2>();
  const status = useRouteChangeStatus();
  return (
    <NProgress isAnimating={status === Status.Loading}>
      {({ isFinished, progress, animationDuration }) => (
        <div
          css={css`
            opacity: ${isFinished ? 0 : 1};
            pointer-events: none;
            transition: opacity ${animationDuration}ms linear;
          `}
        >
          <div
            css={css`
              background: ${theme.primaryColor};
              position: fixed;
              top: 0;
              left: 0;
              height: 2px;
              width: 100%;
              z-index: 1000;
              margin-left: ${(-1 + progress) * 100}%;
              transition: margin-left ${animationDuration}ms linear;
            `}
          ></div>
        </div>
      )}
    </NProgress>
  );
};
