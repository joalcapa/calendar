'use client';

import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

/**
 * A provider component that sets up the React Query client and manages
 * its state, allowing for server-side data hydration.
 *
 * @param children - The React nodes to be rendered within the provider.
 * @param state - The initial state of the query data, which can be used to
 *                hydrate the query client with server-side data.
 *
 * @returns A React element that wraps its children in a QueryClientProvider
 *          with the configured query client.
 */
export function ReactQueryProvider({ children, state }: { children: React.ReactNode; state: unknown }) {
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        if (state) {
            queryClient.setQueryData(state); // Set the query data from the initial state if available
        }
    }, [state, queryClient]);

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/**
 * A hydration component that wraps its children in a HydrationBoundary,
 * enabling the React Query library to manage the hydration of query data
 * from server-side rendering.
 *
 * @param children - The React nodes to be rendered within the hydration boundary.
 * @param state - The initial state of the query data to be hydrated.
 *
 * @returns A React element that wraps its children in a HydrationBoundary,
 *          allowing for proper hydration of query data.
 */
export function Hydrate({ children, state }: { children: React.ReactNode; state: unknown }) {
    return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
