import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const dogsApi = createApi({
    reducerPath: 'dogsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://random.dog/' }),
    endpoints: (builder) => ({
        getRandomDog: builder.query({
            query: () => `woof.json`,
        }),
    }),
})

export const { useGetRandomDogQuery } = dogsApi