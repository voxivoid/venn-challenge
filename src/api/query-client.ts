import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

export function createQueryClient(config?: QueryClientConfig) {
  return new QueryClient({
    ...config,
    defaultOptions: {
      ...config?.defaultOptions,
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        ...config?.defaultOptions?.queries,
      },
    },
  });
}

export const queryClient = createQueryClient();
