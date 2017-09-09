import React from 'react';
import PropTypes from 'prop-types';
import DeleteModal from "./DeleteModal";
import SpinnerWrapper from "../../Common/SpinnerWrapper";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import {IntlWrapper} from "../../Common/IntlWrapper";

class AdminTable extends React.PureComponent {
  static propTypes = {
    intlPrefix: PropTypes.string.isRequired,
    models: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    modelToDeleteId: PropTypes.number.isRequired,
    colProps: PropTypes.arrayOf(PropTypes.object).isRequired,
    errors: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      fetchModels: PropTypes.func.isRequired,
      deleteModel: PropTypes.func.isRequired,
      showDeleteModal: PropTypes.func.isRequired,
      hideDeleteModal: PropTypes.func.isRequired
    }).isRequired
  };

  componentWillMount() {
    this.props.actions.fetchModels();
  }

  actionsFormatter = (cell, row) => {
    let onDelete = () => this.props.actions.showDeleteModal(row.id);
    return (
      <div className="btn-group">
        <button className="btn btn-xs btn-outline btn-primary">
          <i className="fa fa-pencil"/>
        </button>
        <button onClick={onDelete} className="btn btn-xs btn-outline btn-danger">
          <i className="fa fa-trash"/>
        </button>
      </div>
    );
  };

  actionsOptions() {
    return {
      headerAlign: 'center',
      dataAlign: 'center',
      width: '7%',
      dataFormat: this.actionsFormatter
    }
  }

  renderColumn(props, key) {
    const {intl, intlPrefix} = this.props;
    if (props.dataField === 'id')
      return (
        <TableHeaderColumn isKey key={key} noSearch dataField='id'>
          {intl('indexTable.tableHeaders.id')}
        </TableHeaderColumn>);
    if (props.dataField === 'actions')
      return (
        <TableHeaderColumn key={key} {...this.actionsOptions()} noSearch>
          {intl('indexTable.tableHeaders.actions')}
        </TableHeaderColumn>);
    return (
      <TableHeaderColumn key={key} {...props}>
        {intl(`${intlPrefix}.tableHeaders.${props.dataField}`)}
      </TableHeaderColumn>);
  }

  render() {
    const {isLoading, modelToDeleteId, models, actions, intl, intlPrefix, colProps} = this.props;
    return (
      <div>
        <SpinnerWrapper isActive={isLoading}>
          <BootstrapTable data={models} search striped hover condensed>
            {colProps.map((props, index) => this.renderColumn(props, index))}
          </BootstrapTable>
        </SpinnerWrapper>
        <DeleteModal isOpen={!isNaN(modelToDeleteId)}
                     onAccept={actions.deleteModel}
                     title={intl(`${intlPrefix}.deleteModal.title`)}
                     description={intl(`${intlPrefix}.deleteModal.description`)}
                     errors={this.props.errors.deleting}
                     isLoading={this.props.isLoading}
                     onClose={actions.hideDeleteModal}/>
      </div>
    );
  }
}

export default IntlWrapper(AdminTable);
