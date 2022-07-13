import networkReducer from './reducers/networks.reducer';
import { configureStore } from '@reduxjs/toolkit';
//import thunk from 'redux-thunk'
import { persistStore, createTransform, persistReducer } from "redux-persist";
import { combineReducers } from "redux"
import storage from 'redux-persist/lib/storage';


export const persistConfig = {
  key: 'we3-dashboard',
  storage: storage,
  //blacklist: ['extras'],
  //transforms: [transformCircular],
};

const rootReducer = combineReducers({ networks: networkReducer})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  //middleware: [thunk/* , logger */]
});

export const persistor = persistStore(store);

