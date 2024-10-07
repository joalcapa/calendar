'use client';

import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function ReactQueryProvider({ children, state }: { children: React.ReactNode; state: unknown }) {
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        if (state) {
            queryClient.setQueryData(state);
        }
    }, [state, queryClient]);

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function Hydrate({ children, state }: { children: React.ReactNode; state: unknown }) {
    return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}