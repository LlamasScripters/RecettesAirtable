import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { useEffect, useState } from "react";
import { z } from "zod";

const verifyAccountSearchParamsSchema = z.object({
  token: z.string().jwt({
    message: "Lien expiré. Veuillez demander un nouveau lien de vérification.",
  }),
});

export const Route = createFileRoute("/auth/_layout/verify-account")({
  component: VerifyAccountPage,
  validateSearch: zodValidator(verifyAccountSearchParamsSchema),
  onError: () => {
    throw redirect({ to: "/auth/login" });
  },
});

function VerifyAccountPage() {
  const navigate = useNavigate();
  const { token } = Route.useSearch();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        navigate({ to: "/auth/login" });
        return;
      }

      try {
        // TODO: Intégration avec l'API pour vérifier le token
        console.log("Vérification du token:", token);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulation d'une API

        // Simulons un succès
        setStatus("success");
        setTimeout(() => {
          navigate({ to: "/auth/account-validated" });
        }, 2000);
      } catch (error) {
        setStatus("error");
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="text-center">
      {status === "loading" && (
        <>
          <div className="mb-6 flex justify-center">
            <svg
              className="animate-spin h-12 w-12 text-emerald-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Vérification en cours...</h1>
          <p className="text-gray-600">
            Nous vérifions votre compte. Veuillez patienter un instant.
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-4">Erreur de vérification</h1>
          <p className="text-gray-600 mb-6">
            Le lien de vérification est invalide ou a expiré. Veuillez
            réessayer.
          </p>
        </>
      )}
    </div>
  );
}
