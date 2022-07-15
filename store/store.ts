import networks from './reducers/networks.reducer';
import address from './reducers/address.reducer';
import customTokens from './reducers/custom-tokens.reducer';
import { configureStore } from '@reduxjs/toolkit';
//import thunk from 'redux-thunk'
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux"
import storage from 'redux-persist/lib/storage';


export const persistConfig = {
  key: 'we3-dashboard',
  storage: storage,
  //blacklist: ['extras'],
  //transforms: [transformCircular],
};

const rootReducer = combineReducers({ networks, address, customTokens})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  //middleware: [thunk/* , logger */]
});

export const persistor = persistStore(store);

