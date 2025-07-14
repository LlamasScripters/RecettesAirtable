import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log l'erreur pour le debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card rounded-lg shadow-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Oops, une erreur s'est produite
                </h2>
                <p className="text-sm text-muted-foreground">
                  L'application a rencontré un problème inattendu
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-4">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  {this.state.error.message}
                </p>
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-600 dark:text-red-400 cursor-pointer">
                      Détails techniques
                    </summary>
                    <pre className="mt-1 text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={this.handleRetry}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Recharger la page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Composant de fallback pour les erreurs de requête
export function QueryErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Erreur de chargement
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message || 'Une erreur est survenue lors du chargement des données'}
        </p>
        <Button
          onClick={retry}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    </div>
  );
}