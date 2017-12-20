import * as React from 'react';
import { BootstrapTable, BootstrapTableProps, TableHeaderColumn } from 'react-bootstrap-table';
import { User } from '../../../types/models';
import { ButtonEvent } from '../../../types/html';
import { DangerButton, PrimaryButton } from '../../Common/Buttons/Buttons';
import { default as InjectIntl, IntlProps } from '../../Common/InjectIntl';

interface AdminModelTableProps extends BootstrapTableProps {
  onDelete: Function;
  onAdd: Function;
  onEdit: Function;
}

export default InjectIntl<AdminModelTableProps>(({
                                                   onDelete, onAdd, onEdit,
                                                   children, intl, ...props
                                                 }: AdminModelTableProps & IntlProps) => {
  function handleAddClick(e: ButtonEvent) {
    e.preventDefault();
    onAdd();
  }

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
      <PrimaryButton onClick={handleAddClick}>
        {intl('admin.modelTable.buttons.add')}
      </PrimaryButton>
    </div>
  );
});