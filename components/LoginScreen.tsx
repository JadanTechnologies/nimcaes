
import React, { useState } from 'react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulated network delay
    setTimeout(() => {
      if (username === 'J28012026' && password === 'Jadan@2026') {
        onLoginSuccess();
      } else {
        setError('Invalid credentials. Please contact your administrator.');
        setIsSubmitting(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-blue-600 to-green-600"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-900/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-green-900/20 mb-4">
            N
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">NIMC Internal Portal</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-slate-600"
              placeholder="Enter ID"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-slate-600"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2 px-3 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              isSubmitting ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/20 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : (
              'Secure Login'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col items-center gap-2">
          <p className="text-[10px] text-slate-600 text-center leading-relaxed">
            Unauthorized access to this system is prohibited by the Cybercrime Act 2015. 
            All activities are monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
