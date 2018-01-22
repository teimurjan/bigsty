import { DeleteUserState } from './reducer';
import { DeleteUserActionCreatorsMapObject } from './actions';
import { IntlProps } from '../../../Common/injectIntl';
import * as React from 'react';
import injectIntl from '../../../Common/injectIntl';
import { Modal, ModalBody, ModalClose, ModalFooter, ModalHeader } from '../../../Common/Modal';
import { Button, DangerButton } from '../../../Common/Buttons/Buttons';

export interface DeleteUserProps extends DeleteUserState {
  isOpen: boolean,
  actions: DeleteUserActionCreatorsMapObject;
}

export default injectIntl(({
                             intl, isOpen, isLoading, actions, errors
                           }: IntlProps & DeleteUserProps) => {
  const hasErrors = errors !== undefined;

  function renderBody() {
    return hasErrors ?
      <small className="text-danger">{intl('errors.common')}</small> :
      <p>{intl('admin.deleteUser.description')}</p>;
  }

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader className="p-xs">
        <ModalClose onClick={actions.close}/>
      </ModalHeader>
      <ModalBody>
        {renderBody()}
      </ModalBody>
      <ModalFooter>
        <Button onClick={actions.close}>{intl('admin.deleteModal.buttons.cancel')}</Button>
        <DangerButton disabled={hasErrors || isLoading} onClick={actions.deleteUser} outline>
          {intl('admin.deleteModal.buttons.delete')}
        </DangerButton>
      </ModalFooter>
    </Modal>
  );
});