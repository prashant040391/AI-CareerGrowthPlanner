import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CareerProvider } from "./context/CareerContext";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const AnalyzePage = lazy(() => import("./pages/AnalyzePage"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/analyze" component={AnalyzePage} />
        <Route path="/results" component={ResultsPage} />
        <Route>
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
              <a href="/" className="text-indigo-600 hover:underline text-sm">Go back home</a>
            </div>
          </div>
        </Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CareerProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </CareerProvider>
    </QueryClientProvider>
  );
}

export default App;
