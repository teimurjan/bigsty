/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import * as React from 'react';

import { mediaQueries } from 'src/styles/media';

export interface IProps {
  children?: React.ReactNode;
  className?: string;
}

export const Menu = ({ children, className }: IProps) => <aside className={className}>{children}</aside>;

export interface IMenuListProps {
  className?: string;
  children?: React.ReactNode | HTMLCollection;
  collapsed?: boolean;
  direction?: 'column' | 'row';
}

let heightAutoTimeoutID: NodeJS.Timeout;
let height0TimeoutID: NodeJS.Timeout;

const List = ({ children, className, collapsed, direction = 'column' }: IMenuListProps) => {
  const ref = React.useRef<HTMLUListElement>(null);
  const [height, setHeight] = React.useState<number | undefined | 'auto'>(collapsed ? 0 : ref.current?.scrollHeight);

  React.useEffect(() => {
    if (!collapsed) {
      setHeight(ref.current?.scrollHeight);
      heightAutoTimeoutID = setTimeout(() => setHeight('auto'), 300);
    } else {
      setHeight(ref.current?.scrollHeight);
      height0TimeoutID = setTimeout(() => setHeight(0), 0);
    }
  }, [collapsed, ref]);

  React.useEffect(() => () => [heightAutoTimeoutID, height0TimeoutID].forEach(clearTimeout), []);

  return (
    <ul
      ref={ref}
      style={{ height }}
      css={css`
        display: flex;
        flex-direction: column;
        margin: 0 !important;
        transition: height 300ms ease-in-out;
        overflow: hidden;

        &.row {
          flex-direction: row;

          @media ${mediaQueries.maxWidth768} {
            flex-direction: column;
          }
        }
      `}
      className={classNames(className, direction)}
    >
      {children}
    </ul>
  );
};

Menu.List = List;

export interface IMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  className?: string;
  children?: React.ReactNode | HTMLCollection;
}

const Item = ({ children, className }: IMenuListProps) => <li className={className}>{children}</li>;

Menu.Item = Item;
