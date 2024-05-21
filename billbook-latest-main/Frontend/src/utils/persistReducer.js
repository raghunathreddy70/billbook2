import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import productsReducer from '../reducers/lowstockproductreducers';
import userReducer from '../reducers/userReducer';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
    products : productsReducer,
    user: userReducer,
 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;