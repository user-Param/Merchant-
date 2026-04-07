'use client';

import React from 'react';
import { useError } from '@/context/error-context';
import { X, AlertCircle } from 'lucide-react';

export function ErrorModal() {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={clearError}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Icon and content */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Error</h3>
            <p className="mt-2 text-sm text-gray-600 break-words">{error}</p>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={clearError}
            className="rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
