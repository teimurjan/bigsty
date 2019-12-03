import * as React from 'react';

import classNames from 'classnames';

import { useBoolean } from 'src/hooks/useBoolean';
import useClickOutside from 'src/hooks/useClickOutside';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  Trigger: React.ComponentClass<ITriggerProps> | React.StatelessComponent<ITriggerProps>;
}

export type ITriggerProps = React.HTMLAttributes<HTMLElement>;

export const Dropdown = ({ children, className, Trigger, ...props }: IProps) => {
  const { value: isOpen, toggle, setNegative: close } = useBoolean();
  const contentRef = React.useRef(null);

  useClickOutside(contentRef, () => {
    if (isOpen) {
      close();
    }
  });

  return (
    <div className={classNames('dropdown', className, { 'is-active': isOpen })} {...props}>
      <div className="dropdown-trigger">
        <Trigger onClick={toggle} />
      </div>
      <div className="dropdown-menu" role="menu">
        <div ref={contentRef} className="dropdown-content">
          {children}
        </div>
      </div>
    </div>
  );
};
