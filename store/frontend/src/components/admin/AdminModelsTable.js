import React from 'react';
import PropTypes from 'prop-types';
import Spinner from "../utils/Spinner";
import {Link} from "react-router";

class AdminModelsTable extends React.Component {
    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        modelFields: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            className: PropTypes.string
        })).isRequired,
        models: PropTypes.arrayOf(PropTypes.object).isRequired,
        modelActions: PropTypes.shape({
            fetch: PropTypes.func,
            delete: PropTypes.func,
        }).isRequired
    };

    componentWillMount() {
        this.props.modelActions.fetch();
    }

    renderTableHeader() {
        return (
            <thead>
            <tr>
                <th className="footable-visible">Id</th>
                {this.props.modelFields.map((field, index) => {
                    return (
                        <th key={`table-header-${index}`} className="footable-visible">{field.value}</th>
                    )
                })}
                <th className="footable-visible text-right">Actions</th>
            </tr>
            </thead>
        )
    }

    renderTableBody() {
        const {modelFields, models, modelActions} = this.props;
        return (
            <tbody>
            {models.map((model, modelIndex) => {
                return (
                    <tr key={`table-body-row-${modelIndex}`}
                        className={`footable-${modelIndex % 2 === 0 ? 'even' : 'odd'}`}>
                        <td className="text-left footable-visible">
                            {model.id}
                        </td>
                        {modelFields.map((field, fieldIndex) => {
                            return (
                                <td key={`table-body-entity-${fieldIndex}`}
                                    className="footable-visible"><span
                                    className={field.className || ''}>{model[field.value.toLowerCase()]}</span>
                                </td>
                            )
                        })}
                        <td className="footable-visible text-right">
                            <div className="btn-group">
                                <Link to={`${window.location.pathname}/edit`}>
                                    <button className="btn btn-white btn-xs">Edit</button>
                                </Link>
                                <button className="btn btn-danger btn-xs"
                                        onClick={() => modelActions.delete(model.id)}>Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                )
            })}
            </tbody>
        )
    }

    render() {
        const {isFetching} = this.props;
        return (
            <div className="ibox">
                <div className={`ibox-content ${isFetching ? 'sk-loading' : ''}`}>
                    <Spinner isActive={isFetching}/>
                    <table className="footable table table-striped">
                        {this.renderTableHeader()}
                        {this.renderTableBody()}
                    </table>
                    <Link to={`${window.location.pathname}/add`}>
                        <button className="btn btn-primary btn-w-m">Add new
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default AdminModelsTable;
