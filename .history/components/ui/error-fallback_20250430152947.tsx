import React from 'react';
import { Button } from './button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  message?: string;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  message = "Ocorreu um erro ao carregar este conteúdo."
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-muted text-center space-y-4">
      <AlertTriangle className="h-12 w-12 text-yellow-500" />
      <h2 className="text-lg font-medium">Ops! Algo deu errado</h2>
      <p className="text-muted-foreground max-w-md">{message}</p>
      {error && process.env.NODE_ENV === 'development' && (
        <div className="bg-muted p-2 rounded-md text-sm text-left w-full overflow-auto">
          <p className="font-mono">{error.message}</p>
        </div>
      )}
      {resetErrorBoundary && (
        <Button
          onClick={resetErrorBoundary}
          className="mt-4"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
} 