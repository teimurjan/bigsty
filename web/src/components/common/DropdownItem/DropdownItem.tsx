import * as React from 'react';

import classNames from 'classnames';

export interface IProps {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => any;
}

export const DropdownItem = ({ children, className, onClick, href }: IProps) => {
  const handleClick = React.useCallback(
    (e: React.SyntheticEvent<HTMLAnchorElement>) => {
      if (!href) {
        e.preventDefault();
      }

      if (onClick) {
        onClick();
      }
    },
    [href, onClick],
  );

  return (
    <a href={href || '#'} className={classNames('dropdown-item', className)} onClick={handleClick}>
      {children}
    </a>
  );
};
