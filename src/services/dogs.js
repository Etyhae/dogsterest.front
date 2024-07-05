import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const dogsApi = createApi({
    reducerPath: 'dogsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://random.dog/' }),
    endpoints: (builder) => ({
        getRandomDog: builder.query({
            query: () => `woof.json`,
        }),
        getSomeDogs: builder.query({
            async queryFn(count, _queryApi, _extraOptions, baseQuery) {
                try {
                    const results = [];
                    for (let i = 0; i < count; i++) {
                        const result = await baseQuery('woof.json');
                        if (result.error) {
                            return { error: result.error };
                        }
                        results.push(result.data);
                    }
                    return { data: results };
                } catch (error) {
                    return { error: { status: 'Error fetching several dogs', message: error.message } };
                }
            },
        }),
    }),
})

export const { useGetRandomDogQuery, useGetSomeDogsQuery } = dogsApi;
