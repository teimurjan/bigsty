import * as React from 'react';

import { IntlShape } from 'react-intl';

import { Button } from 'src/components/common/Button/Button';
import { Message } from 'src/components/common/Message/Message';
import { Modal } from 'src/components/common/Modal/Modal';
import { ModalBackground } from 'src/components/common/ModalBackground/ModalBackground';
import { ModalCard } from 'src/components/common/ModalCard/ModalCard';
import { ModalContent } from 'src/components/common/ModalContent/ModalContent';

import { IViewProps as IProps } from './DeleteModalPresenter';

export const DeleteModalView = ({
  isOpen,
  onClose,
  intl,
  onConfirm,
  isLoading = false,
  error,
  ...props
}: IProps & { intl: IntlShape }) => {
  const onConfirmClick = React.useCallback(() => onConfirm(), [onConfirm]);

  return (
    <Modal isOpen={isOpen} {...props}>
      <ModalBackground onClick={onClose} />
      <ModalContent>
        {error ? (
          <Message color="is-danger">
            <Message.Header>
              {intl.formatMessage({ id: 'common.error' })}
              <ModalCard.Close onClick={onClose} />
            </Message.Header>
            <Message.Body>{intl.formatMessage({ id: error })}</Message.Body>
          </Message>
        ) : (
          <ModalCard>
            <ModalCard.Head>
              <ModalCard.Title>{intl.formatMessage({ id: 'common.deleteApproval' })}</ModalCard.Title>
              <ModalCard.Close onClick={onClose} />
            </ModalCard.Head>
            <ModalCard.Foot>
              <Button color="is-primary" onClick={onConfirmClick} loading={isLoading} disabled={!!error}>
                {intl.formatMessage({ id: 'common.yes' })}
              </Button>
              <Button color="is-danger" onClick={onClose}>
                {intl.formatMessage({ id: 'common.no' })}
              </Button>
            </ModalCard.Foot>
          </ModalCard>
        )}
      </ModalContent>
    </Modal>
  );
};
