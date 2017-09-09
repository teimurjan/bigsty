import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/admin/layout';
import Layout from "../../components/Admin/Layout/Layout";
import {logout} from "../../actions/login";
import {getUserData} from "../../utils";

function mapStateToProps(state) {
    return {
        ...state.adminMain, admin: getUserData()
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...actions, logout}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)