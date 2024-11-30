import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/UserSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    user: userReducer,
});
const persistConfig = {
    key: "root",
    storage,
    version: 1,
};
const persistedUser = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedUser,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
export const persistor = persistStore(store);
