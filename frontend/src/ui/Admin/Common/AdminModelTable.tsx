import * as React from 'react';
import { BootstrapTable, BootstrapTableProps, TableHeaderColumn } from 'react-bootstrap-table';
import { DangerButton, PrimaryButton } from '../../Common/Buttons/Buttons';
import { default as injectIntl, IntlProps } from '../../Common/injectIntl';
import { ButtonEvent } from '../../../typings/html-shortcuts';
import { User } from '../../../typings/api-models';

interface AdminModelTableProps extends BootstrapTableProps {
  onDelete: Function;
  onAdd: (e: ButtonEvent) => void;
  onEdit: Function;
}

export default injectIntl<AdminModelTableProps>(({
                                                   onDelete, onAdd, onEdit,
                                                   children, intl, ...props
                                                 }: AdminModelTableProps & IntlProps) => {

  const actionsColumnFormatter = (cell: {}, user: User) => {
    function handleDeleteClick(e: ButtonEvent) {
      e.preventDefault();
      onDelete(user.id);
    }

    function handleEditClick(e: ButtonEvent) {
      e.preventDefault();
      onEdit(user.id);
    }

    return (
      <div>
        <PrimaryButton className="col-md-6" onClick={handleEditClick}>
          {intl('admin.modelTable.buttons.edit')}
        </PrimaryButton>
        <DangerButton className="col-md-6" onClick={handleDeleteClick}>
          {intl('admin.modelTable.buttons.delete')}
        </DangerButton>
      </div>
    );
  };

  return (
    <div className="admin-model-table">
      <BootstrapTable {...props}>
        {children}
        <TableHeaderColumn dataFormat={actionsColumnFormatter}/>
      </BootstrapTable>
      <PrimaryButton className="m-t-sm" mWidth onClick={onAdd}>
        {intl('admin.modelTable.buttons.add')}
      </PrimaryButton>
    </div>
  );
});