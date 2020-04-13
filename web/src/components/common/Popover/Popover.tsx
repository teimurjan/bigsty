/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import Link from 'next/link';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { usePopper, PopperProps } from 'react-popper';
import { CSSTransition } from 'react-transition-group';

import { useBoolean } from 'src/hooks/useBoolean';
import useClickOutside from 'src/hooks/useClickOutside';
import { ITheme } from 'src/themes';
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

export type TriggerProps =
  | {
      onClick: React.MouseEventHandler;
    }
  | {
      onMouseEnter: React.MouseEventHandler;
      onMouseLeave: React.MouseEventHandler;
    };

interface IProps<T> {
  TriggerComponent?: React.ComponentType<TriggerProps & React.RefAttributes<T>>;
  renderTrigger?: RenderTrigger<T>;
  hasArrow?: boolean;
  children?: React.ReactNode | RenderChildren;
  forceClose?: boolean;
  preventOverflow?: boolean;
  placement?: PopperProps['placement'];
}

export const Popover = <T extends HTMLElement>({
  TriggerComponent,
  renderTrigger,
  hasArrow = false,
  children,
  forceClose = false,
  preventOverflow = true,
  placement = 'bottom-start',
}: IProps<T>) => {
  const popoverRoot = safeDocument(d => d.getElementById('popoverRoot'), null);

  const { value: isOpen, toggle, setNegative: close, setPositive: open } = useBoolean();

  const triggerRef = React.useRef<T>(null);
  const [popperRef, setPopperRef] = React.useState<HTMLDivElement | null>(null);
  const arrowRef = React.useRef<HTMLDivElement>(null);

  useClickOutside([{ current: popperRef }, triggerRef], close);

  const modifiers = React.useMemo(() => {
    const modifiers_ = [];
    if (hasArrow) {
      modifiers_.push({ name: 'arrow', options: { element: arrowRef } });
    }
    if (preventOverflow) {
      modifiers_.push({ name: 'preventOverflow', enabled: true, options: { escapeWithReference: true } });
    }
    return modifiers_;
  }, [hasArrow, arrowRef, preventOverflow]);

  const popper = usePopper(triggerRef.current, popperRef, { modifiers, placement });

  const trigger = React.useMemo(() => {
    if (renderTrigger) {
      return renderTrigger({ ref: triggerRef, open, close, isOpen, toggle });
    }

    if (TriggerComponent) {
      return <TriggerComponent ref={triggerRef} onClick={open} />;
    }

    return null;
  }, [renderTrigger, TriggerComponent, open, close, isOpen, toggle]);

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
  const theme = useTheme<ITheme>();

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

interface IPopoverLinkProps {
  href?: string;
  asPath?: string;
  onClick?: React.MouseEventHandler;
  active?: boolean;
}

const PopoverLink: React.FC<IPopoverLinkProps> = ({ children, href, asPath, onClick, active }) => {
  const theme = useTheme<ITheme>();

  const modifiedOnClick = React.useCallback(
    e => {
      if (!href) {
        e.preventDefault();
      }

      onClick && onClick(e);
    },
    [href, onClick],
  );

  const anchor = (
    <a
      className={classNames({ active })}
      href={href || '#'}
      onClick={modifiedOnClick}
      css={css`
        color: ${theme.dark};
        transition: color 300ms;
        position: relative;
        display: inline-block;

        &.active {
          color: ${theme.info};
          font-weight: bold;
        }

        .popover-link > &::before {
          content: '';
          position: absolute;
          bottom: -2.5px;
          width: 100%;
          height: 2px;
          transform: translateX(-100%);
          background: ${theme.dark};
          transition: transform 200ms;
        }

        .popover-link:hover > &::before {
          transform: translateX(0);
        }
      `}
    >
      {children}
    </a>
  );

  return (
    <div
      className="popover-link"
      css={css`
        overflow: hidden;
        cursor: pointer;
        padding: 5px 0;
      `}
    >
      {href ? (
        <Link href={href} as={asPath}>
          {anchor}
        </Link>
      ) : (
        anchor
      )}
    </div>
  );
};

Popover.Link = PopoverLink;
