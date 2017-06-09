import React from 'react';
import PropTypes from 'prop-types';
import FileInput from "./utils/FileInput";

class AdminProductCreation extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
        discount: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        category: PropTypes.object,
        categories: PropTypes.array.isRequired,
        errors: PropTypes.object.isRequired,
        isLoading: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            createProduct: PropTypes.func.isRequired,
            fetchCategories: PropTypes.func.isRequired,
            changeImage: PropTypes.func.isRequired,
            changeName: PropTypes.func.isRequired,
            changeDescription: PropTypes.func.isRequired,
            changePrice: PropTypes.func.isRequired,
            changeDiscount: PropTypes.func.isRequired,
            changeQuantity: PropTypes.func.isRequired,
            changeCategory: PropTypes.func.isRequired
        }).isRequired
    };

    componentWillMount() {
        this.props.actions.fetchCategories();
    }

    hasFieldsErrors = (fieldName) => this.props.errors[fieldName].length > 0;

    handleChangeName = (e) => this.props.actions.changeName(e.target.value);
    handleChangeDescription = (e) => this.props.actions.changeDescription(e.target.value);
    handleChangePrice = (e) => this.props.actions.changePrice(e.target.value);
    handleChangeDiscount = (e) => this.props.actions.changeDiscount(e.target.value);
    handleChangeQuantity = (e) => this.props.actions.changeQuantity(e.target.value);
    handleChangeCategory = (e) => this.props.actions.changeCategory(this.props.categories[e.target.value]);

    handleSubmitForm = (e) => {
        e.preventDefault();
        this.props.actions.createProduct();
    };

    render() {
        const {
            name,
            description,
            price,
            quantity,
            discount,
            errors,
        } = this.props;
        const formGroupClassName = 'form-group p-sm';
        return (
            <div className="ibox-content">
                <form className="white-bg form-horizontal" onSubmit={this.handleSubmitForm}>
                    <div className={formGroupClassName}>
                        <label className="col-sm-1 control-label">Name</label>
                        <div className="col-sm-11">
                            <input type="text" className="form-control"
                                   value={name} onChange={this.handleChangeName}/>
                            {this.hasFieldsErrors('name') &&
                            <small className="text-danger help-block m-b-none">{errors.name[0]}</small>}
                        </div>
                    </div>
                    <div className={formGroupClassName}>
                        <label className="col-sm-1 control-label">Description</label>
                        <div className="col-sm-11">
                            <textarea className="form-control" rows={7}
                                      value={description} onChange={this.handleChangeDescription}/>
                            {this.hasFieldsErrors('description') &&
                            <small className="text-danger help-block m-b-none">{errors.description[0]}</small>}
                        </div>
                    </div>
                    <div className={formGroupClassName}>
                        <label className="col-sm-1 control-label">Price</label>
                        <div className="col-sm-4">
                            <input type="text" className="form-control" value={price}
                                   onChange={this.handleChangePrice}/>
                            {this.hasFieldsErrors('price') &&
                            <small className="text-danger help-block m-b-none">{errors.price[0]}</small>}
                        </div>
                    </div>
                    <div className={formGroupClassName}>
                        <label className="col-sm-1 control-label">Discount</label>
                        <div className="col-sm-4">
                            <input type="number" className="form-control" value={discount}
                                   onChange={this.handleChangeDiscount}/>
                            {this.hasFieldsErrors('discount') &&
                            <small className="text-danger help-block m-b-none">{errors.discount[0]}</small>}
                        </div>
                    </div>
                    <div className={formGroupClassName}>
                        <label className="col-sm-1 control-label">Quantity</label>
                        <div className="col-sm-4">
                            <input type="number" className="form-control" value={quantity}
                                   onChange={this.handleChangeQuantity}/>
                            {this.hasFieldsErrors('quantity') &&
                            <small className="text-danger help-block m-b-none">{errors.quantity[0]}</small>}
                        </div>
                    </div>
                    <div className={formGroupClassName}>
                        <label className="col-sm-1 control-label">Image</label>
                        <div className="col-sm-11">
                            <FileInput onLoad={this.props.actions.changeImage}/>
                            {this.hasFieldsErrors('image') &&
                            <small className="text-danger help-block m-b-none">{errors.image[0]}</small>}
                        </div>
                    </div>
                    <div className={formGroupClassName}>
                        <label className="col-sm-1 control-label">Category</label>
                        <div className="col-sm-11">
                            <option selected hidden>Choose here</option>
                            <select className="form-control m-b" onChange={this.handleChangeCategory}>
                                {this.props.categories.map((category, index) =>
                                    <option key={`category-${index}`} value={index}>
                                        {category.name}
                                    </option>)}
                            </select>
                            {this.hasFieldsErrors('category') &&
                            <small className="text-danger help-block m-b-none">{errors.category[0]}</small>}
                        </div>
                    </div>
                    <div className={formGroupClassName}>
                        <div className="col-sm-4">
                            <button className="btn btn-white">Cancel</button>
                            <button className="btn btn-primary" type="submit">Create</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default AdminProductCreation;
