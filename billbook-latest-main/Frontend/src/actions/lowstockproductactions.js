// productsActions.js
import axios from 'axios';
import { GET_PRODUCT_STOCK_FAIL, GET_PRODUCT_STOCK_REQUEST, GET_PRODUCT_STOCK_SUCCESS } from '../constants/lowstockproducts';
import { backendUrl } from '../backendUrl';


export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch({ type: GET_PRODUCT_STOCK_REQUEST });

    const response = await axios.get(`${backendUrl}/api/addProduct/products`); // Replace with your actual API endpoint
    const productsData = response.data;
    // console.log("Response",response)

    // Check stock for each product
    const lowStockProducts = productsData.filter(product => product.openingStock < 20);

    // Dispatch an action to update the global state with the product data
    dispatch({
      type: GET_PRODUCT_STOCK_SUCCESS,
      payload: { products: productsData, lowStockProducts },
    });
  } catch (error) {
    dispatch({
        type: GET_PRODUCT_STOCK_FAIL,
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
  }
};