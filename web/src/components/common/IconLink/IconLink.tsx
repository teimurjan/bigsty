/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { ITheme } from 'src/themes';


interface IProps {
  href?: string;
  onClick?: React.MouseEventHandler;
  icon: IconProp;
  className?: string;
}

export const IconLink = ({ onClick, icon, className, href = '#' }: IProps) => {
  const theme = useTheme<ITheme>();

  return (
    <a
      href={href}
      css={css`
        padding: 7px;
        color: ${theme.dark};

        &:hover {
          background-color: ${theme.whiteTer};
        }
      `}
      className={className}
      onClick={onClick}
    >
      <FontAwesomeIcon size="lg" icon={icon} />
    </a>
  );
};
