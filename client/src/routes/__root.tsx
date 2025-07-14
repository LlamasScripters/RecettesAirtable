import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeSync } from "@/components/ThemeSync";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createRootRoute({
  component: () => (
    <ErrorBoundary>
      <ThemeSync />
      <Outlet />
      <TanStackRouterDevtools />
    </ErrorBoundary>
  ),
});
