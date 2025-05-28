import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/recipes')({
  component: RecipesLayout,
});

function RecipesLayout() {
  return <Outlet />;
} 