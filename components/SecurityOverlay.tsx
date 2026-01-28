
import React from 'react';

interface SecurityOverlayProps {
  status: 'success' | 'lockout';
  onDismiss?: () => void;
}

const SecurityOverlay: React.FC<SecurityOverlayProps> = ({ status, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transition-all transform scale-100 ${
        status === 'success' ? 'bg-white' : 'bg-slate-900 border border-red-900/50 shadow-red-900/20'
      }`}>
        {status === 'success' ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Login Successful</h2>
            <p className="text-slate-600">Welcome back, <span className="font-bold text-green-600">Jabir</span>.</p>
            <p className="text-xs text-slate-400 mt-4">Establishing secure connection to headquarters...</p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Network Access Failure</h2>
            <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-400 leading-relaxed font-medium">
                No network from our server and I reached access attempt. I need to wait 9 hours before I can login again.
              </p>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Error Code: ERR_SRV_LIMIT_EXCEEDED</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityOverlay;
