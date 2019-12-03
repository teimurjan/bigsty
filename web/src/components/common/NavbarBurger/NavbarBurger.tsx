import * as React from 'react';

import classNames from 'classnames';

interface IProps extends React.HTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
}

export const NavbarBurger = ({ className, isActive, ...props }: IProps) => (
  <button
    role="button"
    className={classNames('navbar-burger burger', className, {
      'is-active': isActive,
    })}
    aria-label="menu"
    {...props}
  >
    <span aria-hidden="true" />
    <span aria-hidden="true" />
    <span aria-hidden="true" />
  </button>
);
