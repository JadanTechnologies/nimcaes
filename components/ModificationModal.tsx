
import React, { useState, useMemo } from 'react';
import { NimcRecord } from '../types.ts';

interface ModificationModalProps {
  record: NimcRecord;
  onClose: () => void;
  onSave: (recordId: string, newPhone: string, newLga: string, newNin: string, notes: string) => void;
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
  const [newNin, setNewNin] = useState(record.nin);
  const [notes, setNotes] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  
  const phoneRegex = /^\+234\d{10}$/;
  const ninRegex = /^\d{11}$/;

  const isPhoneValid = useMemo(() => phoneRegex.test(newPhone), [newPhone]);
  const isNinValid = useMemo(() => ninRegex.test(newNin), [newNin]);

  const isChanged = useMemo(() => {
    return (
      newPhone !== record.phoneNumber || 
      newLga !== record.localGovernmentArea || 
      newNin !== record.nin ||
      notes.trim() !== ''
    );
  }, [newPhone, newLga, newNin, notes, record]);

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

  const handleNinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    const val = e.target.value.replace(/\D/g, '').substring(0, 11);
    setNewNin(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhoneValid && isNinValid && isChanged) {
      onSave(record.id, newPhone, newLga, newNin, notes);
    }
  };

  const getPhoneStatusStyles = () => {
    if (!isTouched && newPhone === record.phoneNumber) return 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900';
    if (isPhoneValid) return 'border-green-500 ring-2 ring-green-500/10 focus:ring-green-500/20 text-green-700';
    if (isTouched && newPhone.length < 14) return 'border-blue-400 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900';
    return 'border-red-500 ring-2 ring-red-500/10 focus:ring-red-500/20 text-red-600';
  };

  const getNinStatusStyles = () => {
    if (!isTouched && newNin === record.nin) return 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900';
    if (isNinValid) return 'border-green-500 ring-2 ring-green-500/10 focus:ring-green-500/20 text-green-700';
    if (isTouched && newNin.length < 11) return 'border-blue-400 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900';
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
        
        <div className="overflow-y-auto flex-1 p-8 space-y-10">
          {/* Main Edit Form */}
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
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest flex justify-between">
                  Citizen NIN (11 Digits)
                  <span className={isNinValid ? 'text-green-600' : 'text-slate-400'}>
                    {newNin.length}/11
                  </span>
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={newNin}
                    onChange={handleNinChange}
                    onBlur={() => setIsTouched(true)}
                    placeholder="Enter 11-digit NIN"
                    className={`w-full border rounded-xl pl-4 pr-12 py-3 outline-none transition-all text-sm font-mono font-bold tracking-wider focus:ring-4 ${getNinStatusStyles()}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    {isNinValid && <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                  </div>
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
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">Modification Justification (Notes)</label>
              <textarea 
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setIsTouched(true);
                }}
                placeholder="Briefly explain the reason for this record modification..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/20 outline-none transition-all resize-none h-24"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isPhoneValid || !isNinValid || !isChanged}
                className={`w-full px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl group ${
                  isPhoneValid && isNinValid && isChanged
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30 active:scale-[0.98]' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                Commit Changes & Update Audit Log
              </button>
            </div>
          </form>

          {/* Redesigned Modification History Section */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Modification History</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified Audit Trail ({record.modificationHistory.length})</p>
                </div>
              </div>
            </div>
            
            {record.modificationHistory.length > 0 ? (
              <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[19px] before:w-0.5 before:bg-slate-100 before:z-0">
                {record.modificationHistory.map((log) => (
                  <div key={log.id} className="relative z-10 pl-12 group">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center group-hover:border-blue-500 transition-colors shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                      <div className="px-5 py-3 bg-white border-b border-slate-200 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[10px]">
                            {log.agentName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{log.agentName}</p>
                            <p className="text-[9px] text-slate-400 font-bold tracking-widest">AGENT ID: {log.agentId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-900 font-black">{new Date(log.timestamp).toLocaleDateString()}</p>
                          <p className="text-[9px] text-slate-400 font-bold">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        {/* Data Deltas */}
                        <div className="grid grid-cols-1 gap-3">
                          {log.oldNin !== log.newNin && (
                            <div className="flex flex-col gap-1 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">NIN MODIFICATION</span>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded font-mono line-through">{log.oldNin}</span>
                                <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-mono font-bold">{log.newNin}</span>
                              </div>
                            </div>
                          )}
                          {log.oldPhone !== log.newPhone && (
                            <div className="flex flex-col gap-1 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PHONE MODIFICATION</span>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded font-mono line-through">{log.oldPhone}</span>
                                <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-mono font-bold">{log.newPhone}</span>
                              </div>
                            </div>
                          )}
                          {log.oldLga !== log.newLga && (
                            <div className="flex flex-col gap-1 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">LGA REDEPLOYMENT</span>
                              <div className="flex items-center gap-2 text-[10px]">
                                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded font-bold line-through">{log.oldLga}</span>
                                <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-bold">{log.newLga}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {log.notes && (
                          <div className="mt-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-inner">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" /></svg>
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Agent Justification</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium italic">"{log.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No previous modifications tracked</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModificationModal;
