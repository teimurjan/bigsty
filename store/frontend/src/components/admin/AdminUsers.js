import React from 'react';
import PropTypes from 'prop-types';
import Spinner from "../utils/Spinner";

class AdminUsers extends React.Component {
    static propTypes = {
        users: PropTypes.array.isRequired,
        is_loading: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            fetchUsers: PropTypes.func.isRequired,
            deleteUser: PropTypes.func.isRequired
        }).isRequired
    };

    componentWillMount() {
        this.props.actions.fetchUsers();
    }

    render() {
        return (
            <div className="ibox">
                <div className={`ibox-content ${this.props.is_loading ? 'sk-loading' : ''}`}>
                    <Spinner isActive={this.props.is_loading}/>
                    <table className="footable table table-striped">
                        <thead>
                        <tr>
                            <th className="footable-visible">Id</th>
                            <th className="footable-visible">Email</th>
                            <th className="footable-visible">Name</th>
                            <th className="footable-visible">Group</th>
                            <th className="footable-visible text-right">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.users.map((user, index) => {
                            console.log(user.id);
                            return (
                                <tr key={`user-row-${index}`} className={`footable-${index % 2 === 0 ? 'even' : 'odd'}`}>
                                    <td className="footable-visible">
                                        {user.id}
                                    </td>
                                    <td className="footable-visible">
                                        {user.email}
                                    </td>
                                    <td className="footable-visible">
                                        {user.name}
                                    </td>
                                    <td className="footable-visible">
                                        <span className="label label-primary">{user.group}</span>
                                    </td>
                                    <td className="footable-visible text-right">
                                        <div className="btn-group">
                                            <button className="btn btn-white btn-xs">Edit</button>
                                            <button className="btn btn-danger btn-xs"
                                                    onClick={() => this.props.actions.deleteUser(user.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default AdminUsers;
