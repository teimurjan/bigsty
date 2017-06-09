import React from 'react';
import PropTypes from 'prop-types';
import AdminModelsTable from "./AdminModelsTable";

class AdminUsers extends React.Component {
    static propTypes = {
        users: PropTypes.array.isRequired,
        isLoading: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            fetchUsers: PropTypes.func.isRequired,
            deleteUser: PropTypes.func.isRequired
        }).isRequired
    };


    render() {
        const fields = [
            {value: 'Email'},
            {value: 'Name'},
            {value: 'Group', className: 'label label-primary'}
        ];
        return (
            <AdminModelsTable isFetching={this.props.isLoading}
                              modelFields={fields}
                              models={this.props.users}
                              modelActions={{
                                  fetch: this.props.actions.fetchUsers,
                                  delete: this.props.actions.deleteUser
                              }}/>
        );
    }
}

export default AdminUsers;
