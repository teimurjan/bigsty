/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { usePopper, PopperProps } from 'react-popper';
import { CSSTransition } from 'react-transition-group';

import { useBoolean } from 'src/hooks/useBoolean';
import useClickOutside from 'src/hooks/useClickOutside';
import { useIsTouch } from 'src/hooks/useIsTouch';
import useMouseOutside from 'src/hooks/useMouseOutside';
import { safeDocument } from 'src/utils/dom';

export const poppingCSS = css`
  opacity: 0;
  transition: opacity 300ms ease-in-out, transform 175ms ease-in-out;

  .popping-enter & {
    opacity: 0;
    transform: translateY(10px);
  }
  .popping-enter-active &,
  .popping-enter-done & {
    opacity: 1;
    transform: translateY(0);
  }
  .popping-exit & {
    opacity: 1;
    transform: translateY(0);
  }
  .popping-exit-active &,
  .popping-exit-done & {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

export type RenderChildren = (props: {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}) => React.ReactNode;

export type RenderTrigger<T> = (props: {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
  ref: React.RefObject<T>;
}) => React.ReactNode;

export type TriggerClickProps = {
  onClick: React.MouseEventHandler;
};
export type TriggerHoverProps = {
  onMouseEnter: React.MouseEventHandler;
};
type TriggerClickComponent<T> = React.ComponentType<TriggerClickProps & React.RefAttributes<T>>;
type TriggerHoverComponent<T> = React.ComponentType<TriggerHoverProps & React.RefAttributes<T>>;

interface IProps<T> {
  TriggerComponent?: TriggerClickComponent<T> | TriggerHoverComponent<T>;
  renderTrigger?: RenderTrigger<T>;
  hasArrow?: boolean;
  children?: React.ReactNode | RenderChildren;
  forceClose?: boolean;
  preventOverflow?: boolean;
  openOnHover?: boolean;
  placement?: PopperProps['placement'];
  offset?: number[];
  refsToInclude?: React.RefObject<HTMLElement>[];
}

export const Popover = <T extends HTMLElement>({
  TriggerComponent,
  renderTrigger,
  hasArrow = false,
  children,
  forceClose = false,
  preventOverflow = true,
  placement = 'bottom-start',
  openOnHover = false,
  refsToInclude = [],
  offset,
}: IProps<T>) => {
  const popoverRoot = safeDocument(d => d.getElementById('popoverRoot'), null);

  const { value: isOpen, toggle, setNegative: close, setPositive: open } = useBoolean();

  const triggerRef = React.useRef<T>(null);
  const [popperRef, setPopperRef] = React.useState<HTMLDivElement | null>(null);
  const arrowRef = React.useRef<HTMLDivElement>(null);

  const isTouch = useIsTouch();
  const shouldOpenOnHover = openOnHover && !isTouch;
  useClickOutside([{ current: popperRef }, triggerRef, ...refsToInclude], close);
  useMouseOutside([{ current: popperRef }, triggerRef, ...refsToInclude], close, shouldOpenOnHover && isOpen);

  const modifiers = React.useMemo(() => {
    const modifiers_ = [];
    if (hasArrow) {
      modifiers_.push({ name: 'arrow', options: { element: arrowRef } });
    }
    if (preventOverflow) {
      modifiers_.push({ name: 'preventOverflow', enabled: true, options: { escapeWithReference: true } });
    }
    if (offset) {
      modifiers_.push({ name: 'offset', enabled: true, options: { offset } });
    }
    return modifiers_;
  }, [hasArrow, arrowRef, preventOverflow, offset]);

  const popper = usePopper(triggerRef.current, popperRef, { modifiers, placement });

  const trigger = React.useMemo(() => {
    if (renderTrigger) {
      return renderTrigger({ ref: triggerRef, open, close, isOpen, toggle });
    }

    if (TriggerComponent) {
      return shouldOpenOnHover
        ? React.createElement(TriggerComponent as TriggerHoverComponent<T>, {
            ref: triggerRef,
            onMouseEnter: open,
          })
        : React.createElement(TriggerComponent as TriggerClickComponent<T>, { ref: triggerRef, onClick: open });
    }

    return null;
  }, [renderTrigger, TriggerComponent, open, close, isOpen, toggle, shouldOpenOnHover]);

  return (
    <>
      {trigger}

      {popoverRoot
        ? ReactDOM.createPortal(
            <CSSTransition in={forceClose ? false : isOpen} timeout={300} classNames="popping" unmountOnExit>
              <div
                css={css`
                  z-index: 100;
                  margin-top: 10px;
                `}
                ref={setPopperRef}
                style={popper.styles.popper}
                {...popper.attributes.popper}
              >
                <div
                  css={css`
                    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15), 0 8px 8px 0 rgba(0, 0, 0, 0.05);

                    ${poppingCSS};
                  `}
                >
                  {typeof children === 'function' ? children({ open, close, isOpen, toggle }) : children}
                  {hasArrow && <div ref={arrowRef} style={popper.styles.arrow} />}
                </div>
              </div>
            </CSSTransition>,
            popoverRoot,
          )
        : null}
    </>
  );
};

interface IPopoverContentProps {
  className?: string;
}

const PopoverContent: React.FC<IPopoverContentProps> = ({ children, className }) => {
  const theme = useTheme<CSSTheme>();

  return (
    <div
      className={className}
      css={css`
        background: ${theme.white};
        padding: 10px 20px;
        width: 200px;
      `}
    >
      {children}
    </div>
  );
};

Popover.Content = PopoverContent;
