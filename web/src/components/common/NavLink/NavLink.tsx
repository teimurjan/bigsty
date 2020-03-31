import classNames from 'classnames';
import Link, { LinkProps } from 'next/Link';
import { useRouter, NextRouter } from 'next/router';
import * as React from 'react';

export interface IProps extends LinkProps {
  className?: string;
  active?: (router: NextRouter) => boolean;
}

export const NavLink: React.FC<IProps> = ({ children, className, active, ...props }) => {
  const router = useRouter();

  const isActive = active ? active(router) : router.pathname === props.href;

  return (
    <Link {...props}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={classNames(className, { 'is-active': isActive })}>{children}</a>
    </Link>
  );
};
