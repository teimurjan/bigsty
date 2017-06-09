import React from 'react';
import PropTypes from 'prop-types';
import AdminModelsTable from "./AdminModelsTable";

class AdminCategories extends React.Component {
    static propTypes = {
        categories: PropTypes.array.isRequired,
        isLoading: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            fetchCategories: PropTypes.func.isRequired
        })
    };

    render() {
        const fields = [
            {value: 'Name'},
        ];
        return (
            <AdminModelsTable isFetching={this.props.isLoading}
                              modelFields={fields}
                              models={this.props.categories}
                              modelActions={{
                                  fetch: this.props.actions.fetchCategories
                              }}/>
        );
    }
}

export default AdminCategories;
