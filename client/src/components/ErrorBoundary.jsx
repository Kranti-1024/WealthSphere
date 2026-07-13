import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("WealthSphere ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-xl shadow-lg shadow-black/20 border border-gray-100 m-8">
          <div className="p-4 bg-red-50 text-(--color-negative) rounded-full mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">We're experiencing technical difficulties</h2>
          <p className="text-gray-400 max-w-md">
            Our systems encountered an unexpected issue while loading your financial data. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
