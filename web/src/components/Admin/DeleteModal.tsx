import * as React from "react";

import { InjectedIntlProps, injectIntl } from "react-intl";

import { Button } from "src/components/common/Button/Button";
import { Modal } from "src/components/common/Modal/Modal";
import { ModalBackground } from "src/components/common/ModalBackground/ModalBackground";
import { ModalCard } from "src/components/common/ModalCard/ModalCard";
import { ModalContent } from "src/components/common/ModalContent/ModalContent";
import { Message } from "../common/Message/Message";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => any;
  onConfirm: () => any;
  isLoading?: boolean;
  error: string | undefined;
}

export const DeleteModal = injectIntl(
  ({
    isOpen,
    onClose,
    intl,
    onConfirm,
    isLoading = false,
    error,
    ...props
  }: IProps & InjectedIntlProps) => {
    const onConfirmClick = React.useCallback(
      (e: React.SyntheticEvent) => onConfirm(),
      []
    );

    return (
      <Modal isOpen={isOpen} {...props}>
        <ModalBackground onClick={onClose} />
        <ModalContent>
          <ModalCard>
            <ModalCard.Head>
              <ModalCard.Title>
                {intl.formatMessage({ id: "common.deleteApproval" })}
              </ModalCard.Title>
              <ModalCard.Close onClick={onClose} />
            </ModalCard.Head>
            {error && (
              <ModalCard.Body>
                <Message color="is-danger">
                  <Message.Body>
                    {intl.formatMessage({ id: error })}
                  </Message.Body>
                </Message>
              </ModalCard.Body>
            )}
            <ModalCard.Foot>
              <Button
                color="is-primary"
                onClick={onConfirmClick}
                isLoading={isLoading}
              >
                {intl.formatMessage({ id: "common.yes" })}
              </Button>
              <Button color="is-danger" onClick={onClose}>
                {intl.formatMessage({ id: "common.no" })}
              </Button>
            </ModalCard.Foot>
          </ModalCard>
        </ModalContent>
      </Modal>
    );
  }
);
