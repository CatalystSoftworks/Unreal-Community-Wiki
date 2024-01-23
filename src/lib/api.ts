import { createTRPCProxyClient, httpBatchLink, TRPCClientError } from "@trpc/client";
import type { AppRouter } from "./server/trpc/routes.server";
import { writable } from "svelte/store";
import { onMount } from "svelte";
import { notify } from "./notifications";


export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "/api",
        }),
    ],
});


/**
 * Creates a Svelte store that manages the loading, error, and result state of a TRPC
 * query. The store is initialized with a loading state and then updated with the result
 * of the query. If the query fails, the store is updated with an error state.
 */
export function useQuery<O>(query: () => Promise<O>) {
    const { set, update, subscribe } = writable<{
        /** Is a query currently in progress? */
        loading: boolean;
        /** The error returned by the query. */
        error?: TRPCClientError<AppRouter>;
        /** The data returned by the query. */
        data?: O;
    }>({
        loading: true,
    });

    async function refetch() {
        try {
            update((state) => ({ ...state, loading: true }));

            const data = await query();

            set({ loading: false, data });
        } catch (err) {
            update((state) => ({
                ...state,
                loading: false,
                error: err instanceof TRPCClientError
                    ? err
                    : new TRPCClientError<AppRouter>("An unknown error occurred."),
            }));
        }
    }

    onMount(refetch);

    return {
        subscribe,
        refetch,
    };
}

/**
 * Creates a Svelte store that manages the loading, error, and result state of a TRPC
 * mutation. The store does nothing until the `mutate` method is called, at which point
 * the store is updated with the result of the mutation. If the mutation fails, the
 * store is updated with an error state.
 */
export function useMutation<I, O>(mutation: (input: I) => Promise<O>) {
    const { set, update, subscribe } = writable<{
        /** Is a mutation currently in progress? */
        loading: boolean;
        /** The error returned by the mutation. */
        error?: TRPCClientError<AppRouter>;
        /** The data returned by the mutation. */
        data?: O;
    }>({
        loading: false,
    });

    async function mutate(input: I) {
        try {
            update((state) => ({ ...state, loading: true }));

            const data = await mutation(input);

            set({ loading: false, data });

            return { data };
        } catch (err) {
            const error = err instanceof TRPCClientError
                ? err
                : new TRPCClientError<AppRouter>("An unknown error occurred.");

            notify({ message: error.message, error: err });
            set({ loading: false, error });
            return { error };
        }
    }

    return { subscribe, mutate };
}