import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"

import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'


const persistConfig = {
    key: 'personalflow@root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, userReducer)

const store = configureStore({
    reducer: {
        user: persistedReducer
    },
    middleware: (defaultMD) => defaultMD({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    })
    
})

export default store
export const persistor = persistStore(store)