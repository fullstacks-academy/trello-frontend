import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Board } from "./components/Board";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_, __, ___, mutation) => {
      if (mutation.meta?.invalidates) {
        queryClient.invalidateQueries(mutation.meta.invalidates);
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Board />
    </QueryClientProvider>
  );
}
