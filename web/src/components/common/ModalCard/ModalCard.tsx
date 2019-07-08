import * as React from "react";

import classNames from "classnames";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalCard = ({ children, className, ...props }: IProps) => (
  <div className={classNames("modal-card", className)} {...props}>
    {children}
  </div>
);

interface IModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

ModalCard.Head = ({ children, className, ...props }: IModalHeaderProps) => (
  <header className={classNames("modal-card-head", className)} {...props}>
    {children}
  </header>
);

interface ITitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}

ModalCard.Title = ({ children, className, ...props }: ITitleProps) => (
  <p className={classNames("modal-card-title", className)} {...props}>
    {children}
  </p>
);

interface ICloseProps extends React.HTMLAttributes<HTMLButtonElement> {}

ModalCard.Close = ({ className, ...props }: ICloseProps) => (
  <button
    className={classNames("delete", className)}
    aria-label="close"
    {...props}
  />
);

interface IBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

ModalCard.Body = ({ children, className, ...props }: IBodyProps) => (
  <section className={classNames("modal-card-body", className)} {...props}>
    {children}
  </section>
);

interface IFootProps extends React.HTMLAttributes<HTMLDivElement> {}

ModalCard.Foot = ({ children, className, ...props }: IFootProps) => (
  <footer className={classNames("modal-card-foot", className)} {...props}>
    {children}
  </footer>
);
