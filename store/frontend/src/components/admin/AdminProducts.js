import React from 'react';
import PropTypes from 'prop-types';
import AdminModelsTable from "./AdminModelsTable";

class AdminProducts extends React.Component {
    static propTypes = {
        products: PropTypes.array.isRequired,
        isLoading: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            fetchProducts: PropTypes.func.isRequired,
        }).isRequired
    };

    render() {
        const fields = [
            {value: 'Name'},
            {value: 'Image'},
            {value: 'Discount'},
            {value: 'Price'},
            {value: 'Category'}
        ];
        return (
            <AdminModelsTable
                isFetching={this.props.isLoading}
                modelFields={fields}
                models={this.props.products}
                modelActions={{
                    fetch: this.props.actions.fetchProducts,
                }}/>
        );
    }
}

export default AdminProducts;
