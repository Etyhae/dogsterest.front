import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { dogsApi } from './services/dogs'

export const store = configureStore({
    reducer: {
        [dogsApi.reducerPath]: dogsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(dogsApi.middleware),

})

setupListeners(store.dispatch)