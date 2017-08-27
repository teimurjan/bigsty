import React from 'react';
import PropTypes from 'prop-types';
import SpinnerWrapper from "../utils/SpinnerWrapper";
import DeleteModal from "./utils/DeleteModal";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

class AdminUsers extends React.Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    userToDeleteId: PropTypes.number.isRequired,
    errors: PropTypes.object.isRequired,
    actions: PropTypes.shape({
      fetchUsers: PropTypes.func.isRequired,
      deleteUser: PropTypes.func.isRequired,
      showDeleteModal: PropTypes.func.isRequired,
      hideDeleteModal: PropTypes.func.isRequired
    }).isRequired
  };

  componentWillMount() {
    this.props.actions.fetchUsers();
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

  render() {
    const {isLoading, users, userToDeleteId, actions} = this.props;
    return (
      <div>
        <SpinnerWrapper isActive={isLoading}>
          <BootstrapTable data={users} search striped hover condensed>
            <TableHeaderColumn isKey dataField='id'>Id</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
            <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
            <TableHeaderColumn dataField='group'>Group</TableHeaderColumn>
            <TableHeaderColumn {...this.actionsOptions()} noSearch>Actions</TableHeaderColumn>
          </BootstrapTable>
        </SpinnerWrapper>
        <DeleteModal isOpen={!isNaN(userToDeleteId)}
                     onAccept={actions.deleteUser}
                     title="Delete User"
                     description="Are you sure want to delete this user?"
                     errors={this.props.errors.deleting}
                     isLoading={this.props.isLoading}
                     onClose={actions.hideDeleteModal}/>
      </div>
    );
  }
}

export default AdminUsers;
