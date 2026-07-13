import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-(--color-accent)" />
      <p className="text-gray-400 font-medium animate-pulse">
        Securely fetching your financial data...
      </p>
    </div>
  );
};

export default LoadingSpinner;
