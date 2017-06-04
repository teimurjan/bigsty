import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as actions from '../actions/layout';
import Layout from "../components/layout/Layout";
import {logout} from "../actions/login";
import {getUserGroup} from "../utils";

function mapStateToProps(state) {
    return {
        ...state.layout,
        ...state.application,
        userGroup: getUserGroup()
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...actions, logout}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)