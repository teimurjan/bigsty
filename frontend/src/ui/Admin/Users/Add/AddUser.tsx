import injectIntl, { IntlProps } from '../../../Common/injectIntl';
import * as React from 'react';
import { AddUserState } from './reducer';
import { Modal, ModalBody, ModalClose, ModalFooter, ModalHeader } from '../../../Common/Modal';
import { Button, PrimaryButton, WarningButton } from '../../../Common/Buttons/Buttons';
import FormInputWithLabel from '../../../Common/Forms/FormInputWithLabel';
import Select, { ReactSelectProps } from 'react-select';
import { Group } from '../../../../typings/api-models';
import FormGroup from '../../../Common/Forms/FormGroup';
import Label from '../../../Common/Forms/Label';
import { AddUserActionCreatorsMapObject } from './actions';
import Icon from '../../../Common/Icon';
import { ButtonEvent } from '../../../../typings/html-shortcuts';

export interface AddUserNotStateProps {
  isOpen: boolean;
  onClose: (e: ButtonEvent) => void;
}

export interface AddUserProps extends AddUserState, AddUserNotStateProps {
  actions: AddUserActionCreatorsMapObject;
}

type GroupSelect = new (props: ReactSelectProps<Group>) => Select<Group>;
const GroupSelect = Select as GroupSelect;

const LABEL_CLASS_NAME = 'col-md-1';
const INPUT_CLASS_NAME = 'col-md-10 col-md-offset-1';
const formInputWithLabelProps = {
  labelProps: {className: LABEL_CLASS_NAME},
  formInputWrapperProps: {className: INPUT_CLASS_NAME}
};
export default injectIntl(class extends React.Component<AddUserProps & IntlProps> {
  componentWillReceiveProps(nextProps: AddUserProps) {
    const justOpened = nextProps.isOpen && !this.props.isOpen;
    if (justOpened) {
      this.props.actions.fetchGroups();
    }
  }

  renderAddUserForm() {
    const {intl, group, groups, name, email, password} = this.props;
    return (
      <form className="form-horizontal">
        <FormInputWithLabel labelText={intl('admin.addUser.labels.name')}
                            formInputProps={{value: name}}
                            formGroupProps={{className: 'row'}}
                            {...formInputWithLabelProps}/>
        <FormInputWithLabel labelText={intl('admin.addUser.labels.email')}
                            formInputProps={{value: email}}
                            formGroupProps={{className: 'row'}}
                            {...formInputWithLabelProps}/>
        <FormGroup className="row">
          <Label className={LABEL_CLASS_NAME}>{intl('admin.addUser.labels.group')}</Label>
          <GroupSelect placeholder={intl('admin.addUser.placeholders.groupSelect')}
                       labelKey="name" valueKey="name"
                       className={INPUT_CLASS_NAME} options={groups} value={group}/>
        </FormGroup>
        <FormInputWithLabel labelText={intl('admin.addUser.labels.password')}
                            formInputProps={{value: password}}
                            formGroupProps={{className: 'row'}}
                            {...formInputWithLabelProps}/>
      </form>);
  }

  renderRefetchGroups() {
    const {intl, actions, isLoading} = this.props;
    return (
      <div className="row text-center">
        <h3>{intl('errors.common')}</h3>
        <WarningButton disabled={isLoading} className="m-t-sm" onClick={actions.fetchGroups}>
          <Icon type="refresh" className="m-r-sm"/>
          {intl('errors.common.tryAgain')}
        </WarningButton>
      </div>
    );
  }

  render() {
    const {isOpen, intl, errors, isLoading, onClose} = this.props;

    const hasFetchGroupsErrors = errors.fetchGroups !== undefined;

    return (
      <Modal isOpen={isOpen}>
        <ModalHeader className="p-xs">
          <ModalClose onClick={onClose}/>
        </ModalHeader>
        <ModalBody>
          {hasFetchGroupsErrors ? this.renderRefetchGroups() : this.renderAddUserForm()}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>{intl('admin.addModal.buttons.cancel')}</Button>
          <PrimaryButton disabled={hasFetchGroupsErrors || isLoading} onClick={this.props.actions.addUser} outline>
            {intl('admin.addModal.buttons.add')}
          </PrimaryButton>
        </ModalFooter>
      </Modal>
    );
  }
});