import { CLEAR_ERRORS, GET_PRODUCT_STOCK_FAIL, GET_PRODUCT_STOCK_REQUEST, GET_PRODUCT_STOCK_SUCCESS } from "../constants/lowstockproducts";

// productsReducer.js
const allproducts = {
    products: [],
    lowStockProducts: [],
  };
  
  const productsReducer = (state = allproducts, action) => {
    switch (action.type) {
        case GET_PRODUCT_STOCK_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case GET_PRODUCT_STOCK_SUCCESS:
        return {
          ...state,
          products: action.payload.products,
          lowStockProducts: action.payload.lowStockProducts,
        };
        case GET_PRODUCT_STOCK_FAIL:
        return {
          ...state,
          loading: false,
          products: null,
          lowStockProducts: null,
          error: action.payload,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };
  
  export default productsReducer;