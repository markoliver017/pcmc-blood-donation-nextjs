"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });

        // Log error to console in development
        if (process.env.NODE_ENV === "development") {
            console.error("Error Boundary caught an error:", error, errorInfo);
        }

        // Here you could send error to your error reporting service
        // Example: logErrorToService(error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = "/portal";
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="mb-6">
                            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                We encountered an unexpected error. Please try
                                again or contact support if the problem
                                persists.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={this.handleRetry}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>

                            <Button
                                onClick={this.handleGoHome}
                                variant="outline"
                                className="w-full"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Go to Home
                            </Button>
                        </div>

                        {process.env.NODE_ENV === "development" &&
                            this.state.error && (
                                <details className="mt-6 text-left">
                                    <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                        Error Details (Development Only)
                                    </summary>
                                    <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-red-600 dark:text-red-400 overflow-auto">
                                        <div className="mb-2">
                                            <strong>Error:</strong>
                                            <pre className="whitespace-pre-wrap">
                                                {this.state.error.toString()}
                                            </pre>
                                        </div>
                                        {this.state.errorInfo && (
                                            <div>
                                                <strong>
                                                    Component Stack:
                                                </strong>
                                                <pre className="whitespace-pre-wrap">
                                                    {
                                                        this.state.errorInfo
                                                            .componentStack
                                                    }
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </details>
                            )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
