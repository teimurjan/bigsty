import * as React from 'react';
import { ReactPropsWithClass } from '../../typings/react-custom';

interface ModalProps extends ReactPropsWithClass {
  isOpen: boolean;
  size?: 'lg' | 'sm';
}

export const Modal = ({isOpen, size = 'md', className = '', children}: ModalProps) => {
  const modalClass = `modal inmodal fade ${isOpen ? 'in open' : ''} ${className}`;
  return (
    <div className={modalClass}>
      <div className={`modal-dialog modal-${size}`}>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalClose = ({className = '', onClick}: React.HTMLProps<HTMLButtonElement>) => (
  <button className={`close ${className}`} onClick={onClick}>
    <span>×</span>
  </button>
);

export const ModalBody = ({children, className = ''}: ReactPropsWithClass) => (
  <div className={`modal-body ${className}`}>{children}</div>
);

export const ModalHeader = ({children, className = ''}: ReactPropsWithClass) => (
  <div className={`modal-header ${className}`}>{children}</div>
);

export const ModalFooter = ({children, className = ''}: ReactPropsWithClass) => (
  <div className={`modal-footer ${className}`}>{children}</div>
);