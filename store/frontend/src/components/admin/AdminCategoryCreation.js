import React from 'react';
import PropTypes from 'prop-types';

class AdminCategoryCreation extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        errors: PropTypes.object.isRequired,
        actions: PropTypes.shape({
            changeName: PropTypes.func.isRequired,
            createCategory: PropTypes.func.isRequired
        }).isRequired
    };

    handleSubmitForm = (e) => {
        e.preventDefault();
        this.props.actions.createCategory();
    };

    handleChangeName = (e) => this.props.actions.changeName(e.target.value);

    hasFieldsErrors = (fieldName) => this.props.errors[fieldName].length > 0;

    render() {
        const {name, errors} = this.props;
        const formGroupClassName = "form-group p-sm";
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

export default AdminCategoryCreation;
