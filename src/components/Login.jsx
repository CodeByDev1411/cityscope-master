import React, { useState } from 'react';
import { Shield, Fingerprint, Lock, Command } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [officerId, setOfficerId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!officerId || !passcode) {
      setError('Officer ID and Passcode are required.');
      return;
    }

    setIsAuthenticating(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      if (officerId.toLowerCase() === 'admin' && passcode === 'admin') {
        onLogin();
      } else {
        setError('Invalid credentials. Unauthorized access attempted.');
        setIsAuthenticating(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-slate-900/40 rounded-full blur-[100px]" />
        
        {/* Abstract grid lines */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] mb-4 border border-indigo-400/30">
            <Command className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2 text-center drop-shadow-md">
            CityScope
          </h1>
          <div className="px-3 py-1 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 tracking-widest uppercase">
            RESTRICTED ACCESS
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative scanner line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,1)] animate-[scan_3s_ease-in-out_infinite]" style={{ animationDirection: 'alternate' }} />

          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-indigo-400" />
            Authority Authentication
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Officer Identification</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Fingerprint className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter Officer ID"
                  disabled={isAuthenticating}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Passcode</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  disabled={isAuthenticating}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start text-red-400 text-sm">
                <div className="mr-2 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,1)] animate-ping" />
                </div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-4"
            >
              {isAuthenticating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  VERIFYING CREDENTIALS...
                </>
              ) : (
                'AUTHENTICATE'
              )}
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-4 font-mono">
              UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
