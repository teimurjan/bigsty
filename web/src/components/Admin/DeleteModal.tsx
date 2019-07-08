import * as React from "react";

import { InjectedIntlProps, injectIntl } from "react-intl";

import { Button } from "src/components/common/Button/Button";
import { Modal } from "src/components/common/Modal/Modal";
import { ModalBackground } from "src/components/common/ModalBackground/ModalBackground";
import { ModalCard } from "src/components/common/ModalCard/ModalCard";
import { ModalContent } from "src/components/common/ModalContent/ModalContent";

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => any;
  onConfirm: () => any;
  isLoading?: boolean;
}

export const DeleteModal = injectIntl(
  ({
    isOpen,
    onClose,
    intl,
    onConfirm,
    isLoading = false,
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
