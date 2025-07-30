import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './Modal.css';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  children,
  footer,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <Dialog.Title className="modal-title">{title}</Dialog.Title>
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer">{footer}</div>}
          <Dialog.Close asChild>
            <button className="modal-close" aria-label="Close">
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
