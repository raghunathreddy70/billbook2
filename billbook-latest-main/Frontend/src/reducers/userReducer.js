import axios from "axios";
import { backendUrl } from "../backendUrl";
import { openDB } from "idb";
import { jwtDecode } from "jwt-decode";

// Action types
const SET_USER_DATA = "SET_USER_DATA";
const SET_TOKEN = "SET_TOKEN";
const SET_ACTIVE_BUSINESS = "SET_ACTIVE_BUSINESS"
const SET_CREATE_BUSINESS= "SET_CREATE_BUSINESS"
const UPDATE_TOKEN = "UPDATE_TOKEN";
const LOGOUT = "LOGOUT";

// Action creators
export const VerifyUser = () => async (dispatch) => {
  try {
    // Open IndexedDB database
    const db = await openDB("bill_book_DB", 1, {
      async upgrade(db) {
        if (!db.objectStoreNames.contains('tokens')) {
          db.createObjectStore('tokens');
        }
      },
    });

    if (db.objectStoreNames.contains('tokens')) {
      const tx = db.transaction('tokens', 'readonly');
      const store = tx.objectStore('tokens');
      const currentBusiness = localStorage.getItem("currentBusiness_billBook") || 0;
      const tokenData = await store.get('bill_book');
      if (tokenData) { 
        const response = await axios.post(`${backendUrl}/api/user/registration-verify`, {
          token: tokenData,
          currentBusiness: currentBusiness,
        });
        const userData = await response?.data;

        await dispatch(setUserData(userData));
        await dispatch(setToken(tokenData.token));
      } else {
        console.log("Token not found or invalid in IndexedDB");
      }
    } else {
      console.log("Object store 'tokens' does not exist in IndexedDB");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const logout = () => async (dispatch) => {
  try {
    // Open IndexedDB database
    const db = await openDB("bill_book_DB", 1);

    // Check if 'tokens' object store exists
    if (db.objectStoreNames.contains("tokens")) {
      // Delete 'tokens' object store
      await db.deleteObjectStore("tokens");
      console.log("Token data removed from IndexedDB");
    } else {
      console.log("Object store 'tokens' does not exist in IndexedDB");
    }

    // Dispatch logout action to reset state
    dispatch({
      type: LOGOUT,
    });
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export const setUserData = (userData) => async (dispatch) => {
  try {
    const db = await openDB("bill_book_DB", 1, {
      async upgrade(db) {
        if (db.objectStoreNames.contains("tokens")) {
          db.deleteObjectStore("tokens");
        }

        db.createObjectStore("tokens");
      },
    });

    const tx = db.transaction("tokens", "readwrite");
    const store = tx.objectStore("tokens");
    await store.put(userData?.token, "bill_book");
    await tx.done;

    await dispatch({
      type: SET_USER_DATA,
      payload: jwtDecode(userData.token),
    });
    console.log("User data stored in IndexedDB:", userData);
  } catch (error) {
    console.error("Error storing user data in IndexedDB:", error);
  }
};

export const setActiveBusiness = (businessData) => async (dispatch) => {
  try {
    sessionStorage.setItem("bill_book_active", businessData);
    console.log("businessData", businessData);
    dispatch({
      type: SET_ACTIVE_BUSINESS,
      payload: businessData,
    });
    console.log("Active business set in session storage:", businessData);
  } catch (error) {
    console.error("Error setting active business in session storage:", error);
  }
};



// Reducer
const initialState = {
  token: null,
  userData: null,
  activeBusiness: sessionStorage.getItem("bill_book_active") || null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
      case SET_ACTIVE_BUSINESS:
        return {
          ...state,
          activeBusiness: action.payload,
        };
    case UPDATE_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        userData: null,
      };
    default:
      return state;
  }
};

// Define action creators
export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

export const updateToken = (token) => ({
  type: UPDATE_TOKEN,
  payload: token,
});

export default userReducer;
