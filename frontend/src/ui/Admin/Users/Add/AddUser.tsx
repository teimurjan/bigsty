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
import { AddUserActionCreatorsMapObject } from './actions';

export interface AddUserProps extends AddUserState {
  isOpen: boolean;
  actions: AddUserActionCreatorsMapObject;
}

type GroupSelect = new (props: ReactSelectProps<Group>) => Select<Group>;
const GroupSelect = Select as GroupSelect;

const LABEL_CLASS_NAME = 'col-md-1';
const INPUT_CLASS_NAME = 'col-md-10 col-md-offset-1';

export default InjectIntl(class extends React.Component<AddUserProps & IntlProps> {
  componentWillMount() {
    this.props.actions.fetchGroups();
  }

  render() {
    const {isOpen, intl, group, groups, name, email, password} = this.props;
    const formInputWithLabelProps = {
      labelProps: {className: LABEL_CLASS_NAME},
      formGroupProps: {className: 'row'},
      formInputWrapperProps: {className: INPUT_CLASS_NAME}
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
              <Label className={LABEL_CLASS_NAME}>{intl('admin.addUser.labels.group')}</Label>
              <GroupSelect placeholder={intl('admin.addUser.placeholders.groupSelect')}
                           labelKey="name" valueKey="name"
                           className={INPUT_CLASS_NAME} options={groups} value={group}/>
            </FormGroup>
            <FormInputWithLabel labelText={intl('admin.addUser.labels.password')}
                                formInputProps={{value: password}}
                                {...formInputWithLabelProps}/>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button>{intl('admin.addModal.buttons.cancel')}</Button>
          <Button onClick={this.props.actions.addUser} color="primary" outline>
            {intl('admin.addModal.buttons.add')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
});