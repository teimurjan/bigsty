/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { usePreventedDefault } from 'src/hooks/usePreventedDefault';
import { ITheme } from 'src/themes';
import { preventDefault } from 'src/utils/dom';

interface IProps {
  href?: string;
  onClick?: React.MouseEventHandler;
  icon: IconProp;
  className?: string;
  size?: FontAwesomeIconProps['size'];
}

export const IconLink = ({ onClick, icon, className, href, size = 'lg' }: IProps) => {
  const theme = useTheme<ITheme>();
  const preventedOnClick = usePreventedDefault(onClick);

  return (
    <a
      href={href || '#'}
      css={css`
        padding: 7px;
        color: ${theme.dark};

        &:hover {
          background-color: ${theme.whiteTer};
        }
      `}
      className={className}
      onClick={href ? onClick : preventedOnClick}
    >
      <FontAwesomeIcon size={size} icon={icon} />
    </a>
  );
};
