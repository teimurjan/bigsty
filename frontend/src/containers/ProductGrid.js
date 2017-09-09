import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as actions from '../actions/product-grid';
import ProductGrid from "../components/ProductGrid";

function mapStateToProps(state, props){
    return {
        ...state.productGrid,
        categoryId: props.params.categoryId
    };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductGrid)