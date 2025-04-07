import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/_layout")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary">
            RecetteAI
          </Link>
        </div>
        <Outlet />
      </div>
    </main>
  );
}
