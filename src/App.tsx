import { Board } from "./components/Board";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  mutationCache: new utationCache({
    onSuccess: (_, __, ___, mutation) => {
      if (mutation.meta?.inaroInvalidateKon) {
        queryClient.invalidateQueries(mutation.meta.inaroInvalidateKon);
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
  // Todo
  return (
    <QueryClientProvider client={queryClient}>
      <Board />
    </QueryClientProvider>
  );
}
