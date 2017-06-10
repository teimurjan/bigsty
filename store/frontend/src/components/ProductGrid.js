import React from 'react';
import PropTypes from 'prop-types';

class ProductsGrid extends React.Component {
    static propTypes = {
        categoryId: PropTypes.string.isRequired,
        products: PropTypes.array.isRequired,
        actions: PropTypes.shape({
            fetchProducts: PropTypes.func.isRequired
        })
    };

    componentWillMount() {
        this.props.actions.fetchProducts(this.props.categoryId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.categoryId !== this.props.categoryId)
            this.props.actions.fetchProducts(nextProps.categoryId);
    }

    render() {
        return (
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                    {this.props.products.map((product, index) => {
                        return (
                            <div key={`product-${index}`} className="col-md-3">
                                <div className="ibox">
                                    <div className="ibox-content product-box">
                                        <div style={{overflow: 'hidden'}}>
                                            <div className="img-thumbnail p-md">
                                                <img
                                                    style={{objectFit: 'cover', height: '250px', width: '100%'}}
                                                    src={product.image.replace('store', '')}/>
                                            </div>
                                        </div>
                                        <div className="product-desc p-sm">
                                            <span className="product-price">{product.price}$</span>
                                            <small className="text-muted">{product.category}</small>
                                            <a href="#" className="product-name">{product.name}</a>
                                            <div className="small m-t-xs">{product.short_description}</div>
                                            <div className="m-t-sm">
                                                <a href="#" className="btn btn-xs btn-outline btn-primary">Info
                                                    <i className="fa fa-long-arrow-right"></i> </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default ProductsGrid;
