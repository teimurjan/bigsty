import InjectIntl, { IntlProps } from '../../../Common/InjectIntl';
import * as React from 'react';
import { AddUserState } from './reducer';
import { Modal, ModalBody, ModalClose, ModalFooter, ModalHeader } from '../../../Common/Modal';
import { Button } from '../../../Common/Buttons/Buttons';
import FormInputWithLabel from '../../../Common/Forms/FormInputWithLabel';
import Select, { ReactSelectProps } from 'react-select';
import { Group } from '../../../../typings/api-models';
import FormGroup from '../../../Common/Forms/FormGroup';
import Label from '../../../Common/Forms/Label';

export interface AddUserProps extends AddUserState {
  isOpen: boolean;
}

type GroupSelect = new (props: ReactSelectProps<Group>) => Select<Group>;
const GroupSelect = Select as GroupSelect;

export default InjectIntl(({isOpen, intl, group, groups, name, email, password}: AddUserProps & IntlProps) => {
    const labelClassName = 'col-md-1';
    const inputClassName = 'col-md-10 col-md-offset-1';
    const formInputWithLabelProps = {
      labelProps: {className: labelClassName},
      formGroupProps: {className: 'row'},
      formInputWrapperProps: {className: inputClassName}
    };

    return (
      <Modal isOpen={isOpen}>
        <ModalHeader className="p-xs">
          <ModalClose/>
        </ModalHeader>
        <ModalBody>
          <form className="form-horizontal">
            <FormInputWithLabel labelText={intl('admin.addUser.labels.name')}
                                formInputProps={{value: name}}
                                {...formInputWithLabelProps}/>
            <FormInputWithLabel labelText={intl('admin.addUser.labels.email')}
                                formInputProps={{value: email}}
                                {...formInputWithLabelProps}/>
            <FormGroup className="row">
              <Label className={labelClassName}>{intl('admin.addUser.labels.group')}</Label>
              <GroupSelect placeholder={intl('admin.addUser.placeholders.groupSelect')}
                           labelKey="name" valueKey="name"
                           className={inputClassName} options={groups} value={group}/>
            </FormGroup>
            <FormInputWithLabel labelText={intl('admin.addUser.labels.password')}
                                formInputProps={{value: password}}
                                {...formInputWithLabelProps}/>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button>{intl('admin.addModal.buttons.cancel')}</Button>
          <Button color="primary" outline>{intl('admin.addModal.buttons.add')}</Button>
        </ModalFooter>
      </Modal>
    );
  }
);