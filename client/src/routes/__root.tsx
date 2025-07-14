import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeSync } from "@/components/ThemeSync";

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeSync />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
