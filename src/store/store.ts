import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/userReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { userPreferencesReducer } from './reducers/userPreferencesReducer';
import { payModesReducer } from './reducers/payModesReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

export const Store = configureStore({
    reducer: {
      user: userReducer,
      payModes: payModesReducer,
      preferences: persistReducer(persistConfig, userPreferencesReducer),
    },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

