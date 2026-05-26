"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/config/query";

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = getQueryClient();

    useEffect(() => {
        // useCartStore.persist.rehydrate();
        // useWishlistStore.persist.rehydrate();
    }, []);

    return (

        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};