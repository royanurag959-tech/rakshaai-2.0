import React from 'react';
import { WifiOff, PhoneCall, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  onSync?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline, onSync }) => {
  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-black px-4 py-3 border-b border-amber-500 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-5 h-5 shrink-0 animate-bounce text-black" />
          <div>
            <strong className="text-sm font-black">OFFLINE PROTECTION MODE ACTIVE:</strong>
            <span className="ml-1 font-medium">
              Internet disconnected. Emergency 1930 guidance, safety checklists, and local evidence hashing remain 100% functional.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="tel:1930"
            className="px-3 py-1 rounded-lg bg-black text-white font-bold flex items-center space-x-1"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>Call 1930</span>
          </a>
          {onSync && (
            <button
              onClick={onSync}
              className="px-3 py-1 rounded-lg bg-amber-800 text-white font-bold hover:bg-black transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Sync</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
