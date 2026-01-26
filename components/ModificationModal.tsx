
import React, { useState, useMemo } from 'react';
import { NimcRecord } from '../types';

interface ModificationModalProps {
  record: NimcRecord;
  onClose: () => void;
  onSave: (recordId: string, newPhone: string) => void;
}

const ModificationModal: React.FC<ModificationModalProps> = ({ record, onClose, onSave }) => {
  const [newPhone, setNewPhone] = useState(record.phoneNumber);
  
  const phoneRegex = /^\+234\d{10}$/;
  const isValid = useMemo(() => phoneRegex.test(newPhone), [newPhone]);
  
  // Checks if the user is currently typing something that follows the expected pattern
  const isPatternCorrect = useMemo(() => {
    if (newPhone === '') return true;
    if (!newPhone.startsWith('+')) return false;
    if (newPhone.length > 1 && !newPhone.startsWith('+2')) return false;
    if (newPhone.length > 2 && !newPhone.startsWith('+23')) return false;
    if (newPhone.length > 3 && !newPhone.startsWith('+234')) return false;
    // After +234, everything must be a digit
    if (newPhone.length > 4) {
      const digitsPart = newPhone.substring(4);
      if (!/^\d*$/.test(digitsPart)) return false;
    }
    return newPhone.length <= 14;
  }, [newPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSave(record.id, newPhone);
    }
  };

  const getBorderClass = () => {
    if (newPhone === record.phoneNumber) return 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20';
    if (isValid) return 'border-green-500 ring-2 ring-green-500/10 focus:ring-green-500/20';
    if (!isPatternCorrect || (newPhone.length === 14 && !isValid)) return 'border-red-500 ring-2 ring-red-500/10 focus:ring-red-500/20';
    return 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Modify Data</h2>
            <p className="text-sm text-slate-500">Updating record for {record.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  State
                </label>
                <input 
                  type="text" 
                  value={record.stateOfOrigin} 
                  disabled 
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-slate-600 cursor-not-allowed text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  LGA
                </label>
                <input 
                  type="text" 
                  value={record.localGovernmentArea} 
                  disabled 
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-slate-600 cursor-not-allowed text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  National Identification Number (NIN)
                </label>
                <input 
                  type="text" 
                  value={record.nin} 
                  disabled 
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-600 cursor-not-allowed font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Update Phone Number
                </label>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                    placeholder="+234..."
                    className={`w-full border rounded-lg pl-4 pr-10 py-2.5 outline-none transition-all text-sm font-mono focus:ring-2 ${getBorderClass()}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {isValid ? (
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (!isPatternCorrect || (newPhone.length === 14 && !isValid)) ? (
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : null}
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className={`text-[10px] font-medium transition-colors ${
                    isValid ? 'text-green-600' : 
                    (!isPatternCorrect || (newPhone.length === 14 && !isValid)) ? 'text-red-500' : 'text-slate-400'
                  }`}>
                    {isValid ? 'Valid Format' : 'Format: +234XXXXXXXXXX'}
                  </p>
                  <span className={`text-[10px] font-mono ${newPhone.length === 14 ? (isValid ? 'text-green-600' : 'text-red-500') : 'text-slate-400'}`}>
                    {newPhone.length} / 14
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={!isValid || newPhone === record.phoneNumber}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all shadow-lg ${
                  isValid && newPhone !== record.phoneNumber
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 active:scale-[0.98]' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                Update Record
              </button>
            </div>
          </form>

          {/* Modification History Section */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Modification History
            </h3>
            
            {record.modificationHistory.length > 0 ? (
              <div className="space-y-3">
                {record.modificationHistory.map((log) => (
                  <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:bg-slate-100/50 transition-colors">
                    {/* Log Header with Agent Info */}
                    <div className="px-4 py-2 bg-slate-100/50 border-b border-slate-200 flex justify-between items-center">
                       <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                          {log.agentName.charAt(0)}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">
                          Agent: {log.agentName} <span className="text-slate-400 font-normal">({log.agentId})</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="p-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400 uppercase text-[9px] font-bold mb-1">Old Phone</p>
                          <p className="text-slate-500 font-mono line-through opacity-60 bg-slate-200/50 px-2 py-1 rounded">{log.oldPhone}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 uppercase text-[9px] font-bold mb-1">New Phone</p>
                          <p className="text-green-700 font-mono font-bold bg-green-50 border border-green-100 px-2 py-1 rounded">{log.newPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400">No previous modifications recorded for this citizen.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModificationModal;
