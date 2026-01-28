
import React, { useState, useMemo } from 'react';
import { NimcRecord } from '../types.ts';

interface ModificationModalProps {
  record: NimcRecord;
  onClose: () => void;
  onSave: (recordId: string, newPhone: string, newLga: string) => void;
}

const SOKOTO_LGAS = [
  'Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 
  'Gwadabawa', 'Illela', 'Isa', 'Kware', 'Rabah', 'Sabon Birni', 
  'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 'Tambuwal', 
  'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'
];

const ModificationModal: React.FC<ModificationModalProps> = ({ record, onClose, onSave }) => {
  const [newPhone, setNewPhone] = useState(record.phoneNumber);
  const [newLga, setNewLga] = useState(record.localGovernmentArea);
  const [isTouched, setIsTouched] = useState(false);
  
  const phoneRegex = /^\+234\d{10}$/;
  const isPhoneValid = useMemo(() => phoneRegex.test(newPhone), [newPhone]);
  const isChanged = newPhone !== record.phoneNumber || newLga !== record.localGovernmentArea;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    let val = e.target.value;
    if (!val.startsWith('+234')) {
      val = '+234' + val.replace(/^\+?2?3?4?/, '');
    }
    const prefix = '+234';
    const rest = val.substring(4).replace(/\D/g, '');
    const final = (prefix + rest).substring(0, 14);
    setNewPhone(final);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhoneValid && isChanged) {
      onSave(record.id, newPhone, newLga);
    }
  };

  const getPhoneStatusStyles = () => {
    if (!isTouched && newPhone === record.phoneNumber) return 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900';
    if (isPhoneValid) return 'border-green-500 ring-2 ring-green-500/10 focus:ring-green-500/20 text-green-700';
    if (isTouched && newPhone.length < 14) return 'border-blue-400 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900';
    return 'border-red-500 ring-2 ring-red-500/10 focus:ring-red-500/20 text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Modify Citizen Data</h2>
            <p className="text-sm text-slate-500 font-medium">Internal Record: <span className="text-slate-900">{record.name}</span></p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">State of Origin</label>
                <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 text-sm font-semibold">
                  {record.stateOfOrigin}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">Local Government Area (LGA)</label>
                <select 
                  value={newLga}
                  onChange={(e) => {
                    setNewLga(e.target.value);
                    setIsTouched(true);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                >
                  {SOKOTO_LGAS.map(lga => (
                    <option key={lga} value={lga}>{lga}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Citizen NIN</label>
                <div className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono text-sm tracking-tighter">
                  {record.nin}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest flex justify-between">
                  Identity Phone 
                  <span className={isPhoneValid ? 'text-green-600' : 'text-slate-400'}>
                    {newPhone.length}/14
                  </span>
                </label>
                <div className="relative group">
                  <input 
                    type="tel" 
                    value={newPhone}
                    onChange={handlePhoneChange}
                    onBlur={() => setIsTouched(true)}
                    placeholder="+234..."
                    className={`w-full border rounded-xl pl-4 pr-12 py-3 outline-none transition-all text-sm font-mono font-bold tracking-wider focus:ring-4 ${getPhoneStatusStyles()}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    {isPhoneValid ? (
                      <div className="bg-green-100 rounded-full p-1 animate-in zoom-in duration-300">
                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (isTouched && newPhone.length === 14 && !isPhoneValid) ? (
                      <div className="bg-red-100 rounded-full p-1 animate-bounce">
                        <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isPhoneValid || !isChanged}
                className={`w-full px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl group ${
                  isPhoneValid && isChanged
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30 active:scale-[0.97] hover:-translate-y-0.5' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isPhoneValid && isChanged ? (
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : null}
                  Commit Record Modification
                </span>
              </button>
              {!isChanged && isTouched && (
                <p className="text-center text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-tighter">No changes detected in the form fields</p>
              )}
            </div>
          </form>

          {/* Modification History Section */}
          <div className="pt-8 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center">
                 <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Audit History Log
            </h3>
            
            {record.modificationHistory.length > 0 ? (
              <div className="space-y-4">
                {record.modificationHistory.map((log) => (
                  <div key={log.id} className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex justify-between items-center">
                       <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-black">
                          {log.agentName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-900 uppercase">{log.agentName}</p>
                          <p className="text-[9px] text-slate-400 font-bold">ID: {log.agentId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-500 font-bold">{new Date(log.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      {log.oldPhone !== log.newPhone && (
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-slate-400 uppercase text-[8px] font-black mb-1">Previous Phone</p>
                            <p className="text-slate-400 font-mono text-[10px] line-through">{log.oldPhone}</p>
                          </div>
                          <div className="flex-1 text-right">
                            <p className="text-blue-600 uppercase text-[8px] font-black mb-1">New Phone</p>
                            <p className="text-blue-700 font-mono text-[10px] font-black">{log.newPhone}</p>
                          </div>
                        </div>
                      )}
                      {log.oldLga && log.newLga && log.oldLga !== log.newLga && (
                        <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                          <div className="flex-1">
                            <p className="text-slate-400 uppercase text-[8px] font-black mb-1">Previous LGA</p>
                            <p className="text-slate-400 text-[10px] line-through">{log.oldLga}</p>
                          </div>
                          <div className="flex-1 text-right">
                            <p className="text-blue-600 uppercase text-[8px] font-black mb-1">New LGA</p>
                            <p className="text-blue-700 text-[10px] font-black">{log.newLga}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No Previous Audits Found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModificationModal;
