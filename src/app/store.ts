import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer from "../features/crypto/cryptoSlice";

export const store = configureStore({
    reducer: {
        crypto: cryptoReducer
    }
})

export type RootState = ReturnType<typeof store.getState>