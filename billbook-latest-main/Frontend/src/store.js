import { combineReducers } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
// import thunkMiddleware from 'redux-thunk'; // Middleware (optional)
import { thunk as thunkMiddleware } from 'redux-thunk';
import persistedReducer from './utils/persistReducer';
import userReducer from './reducers/userReducer';

const reducer = combineReducers({
  persistReducer: persistedReducer, 
  user: userReducer
})

let initialState = {};

const store = configureStore({
    reducer: reducer,
    devTools: true,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableStateInvariantCheck: false,
    }).concat(thunkMiddleware),
});

export default store;