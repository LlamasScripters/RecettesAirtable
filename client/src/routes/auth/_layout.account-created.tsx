import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/_layout/account-created")({
  component: AccountCreatedPage,
});

function AccountCreatedPage() {
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Compte créé avec succès !</h1>
      <p className="text-gray-600 mb-6">
        Nous avons envoyé un email de vérification à votre adresse email.
        Veuillez cliquer sur le lien dans cet email pour activer votre compte.
      </p>
      <div className="p-4 bg-blue-50 rounded-lg mb-6">
        <p className="text-blue-800 text-sm">
          Si vous ne trouvez pas l'email, veuillez vérifier votre dossier de
          spam ou votre dossier "Promotions" si vous utilisez Gmail.
        </p>
      </div>
      <Link
        to="/auth/login"
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
      >
        Retour à la connexion
      </Link>
    </div>
  );
}
