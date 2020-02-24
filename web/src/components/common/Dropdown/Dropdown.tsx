/** @jsx jsx */
import * as React from 'react';

import { css, jsx } from '@emotion/core';

import classNames from 'classnames';

import { useBoolean } from 'src/hooks/useBoolean';
import useClickOutside from 'src/hooks/useClickOutside';

type RenderChildren = (props: {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}) => React.ReactNode;

export type ITriggerProps = {
  onClick: React.MouseEventHandler;
};

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode | RenderChildren;
  TriggerComponent?: React.ComponentClass<ITriggerProps> | React.StatelessComponent<ITriggerProps>;
  trigger?: React.ReactNode | RenderChildren;
  menuClassName?: string;
}

export const Dropdown = ({
  children,
  className,
  menuClassName,
  TriggerComponent,
  trigger: triggerProp,
  ...props
}: IProps) => {
  const { value: isOpen, toggle, setNegative: close, setPositive: open } = useBoolean();
  const triggerRef = React.useRef(null);
  const contentRef = React.useRef(null);

  useClickOutside([contentRef, triggerRef], () => {
    if (isOpen) {
      close();
    }
  });

  const trigger = React.useMemo(() => {
    if (TriggerComponent) {
      return <TriggerComponent onClick={toggle} />;
    }

    return typeof triggerProp === 'function' ? triggerProp({ open, close, isOpen, toggle }) : triggerProp;
  }, [TriggerComponent, close, isOpen, open, toggle, triggerProp]);

  return (
    <div className={classNames('dropdown', className, { 'is-active': isOpen })} {...props}>
      <div
        ref={triggerRef}
        css={css`
          width: inherit;
        `}
        className="dropdown-trigger"
      >
        {trigger}
      </div>
      <div className={classNames('dropdown-menu', menuClassName)} role="menu">
        <div ref={contentRef} className="dropdown-content">
          {typeof children === 'function' ? children({ open, close, isOpen, toggle }) : children}
        </div>
      </div>
    </div>
  );
};
