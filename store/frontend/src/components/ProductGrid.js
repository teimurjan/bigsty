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
        this.props.actions.fetchProducts(this.props.categoryId)
    }

    render() {
        console.log(this.props.products);
        return (
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                    {this.props.products.map((product, index) => {
                        return (
                            <div key={`product-${index}`} className="col-md-3">
                                <div className="ibox">
                                    <div className="ibox-content product-box">
                                        <div>
                                            <img className="img-thumbnail" style={{overflow: 'hidden'}}
                                                 src={product.main_image.replace('store', '')}/>
                                        </div>
                                        <div className="product-desc">
                                            <span className="product-price">{product.price}$</span>
                                            <small className="text-muted">{product.category.name}</small>
                                            <a href="#" className="product-name">{product.name}</a>
                                            <div className="small m-t-xs">{product.short_description}</div>
                                            <div className="m-t">
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
