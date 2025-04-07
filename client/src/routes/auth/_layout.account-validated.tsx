import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/_layout/account-validated")({
  component: AccountValidatedPage,
});

function AccountValidatedPage() {
  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Compte validé avec succès !</h1>
      <p className="text-gray-600 mb-6">
        Votre compte a été vérifié et activé avec succès. Vous pouvez maintenant
        vous connecter pour commencer à utiliser RecetteAI.
      </p>
      <Link
        to="/auth/login"
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
      >
        Me connecter
      </Link>
    </div>
  );
}
