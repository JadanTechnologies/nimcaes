
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { NimcRecord } from '../types.ts';

interface ModificationModalProps {
  record: NimcRecord;
  onClose: () => void;
  onSave: (recordId: string, updates: Partial<NimcRecord>, notes: string, photo?: string) => void;
}

const SOKOTO_LGAS = [
  'Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 
  'Gwadabawa', 'Illela', 'Isa', 'Kware', 'Rabah', 'Sabon Birni', 
  'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 'Tambuwal', 
  'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'
];

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'failed';

const ModificationModal: React.FC<ModificationModalProps> = ({ record, onClose, onSave }) => {
  // Form State
  const [formData, setFormData] = useState({
    name: record.name,
    nin: record.nin,
    phoneNumber: record.phoneNumber,
    lga: record.localGovernmentArea,
    address: record.address,
    dob: record.dateOfBirth,
  });
  const [notes, setNotes] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  
  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(record.photo || null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const phoneRegex = /^\+234\d{10}$/;
  const ninRegex = /^\d{11}$/;

  const isPhoneValid = useMemo(() => phoneRegex.test(formData.phoneNumber), [formData.phoneNumber]);
  const isNinValid = useMemo(() => ninRegex.test(formData.nin), [formData.nin]);
  const isChanged = useMemo(() => {
    return (
      formData.name !== record.name ||
      formData.nin !== record.nin ||
      formData.phoneNumber !== record.phoneNumber ||
      formData.lga !== record.localGovernmentArea ||
      formData.address !== record.address ||
      formData.dob !== record.dateOfBirth ||
      capturedPhoto !== record.photo ||
      notes.trim() !== ''
    );
  }, [formData, notes, capturedPhoto, record]);

  // Camera Functions
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  // Fix: Added missing event handler for NIN input field
  const handleNinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, nin: value }));
  };

  // Fix: Added missing event handler for Phone number input field
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, phoneNumber: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid || !isNinValid || !isChanged) return;

    setSyncStatus('syncing');
    
    // Simulate server sync
    setTimeout(() => {
      const success = Math.random() > 0.05; // 95% success rate simulation
      if (success) {
        setSyncStatus('synced');
        setTimeout(() => {
          onSave(record.id, {
            name: formData.name,
            nin: formData.nin,
            phoneNumber: formData.phoneNumber,
            localGovernmentArea: formData.lga,
            address: formData.address,
            dateOfBirth: formData.dob,
            photo: capturedPhoto || undefined
          }, notes, capturedPhoto || undefined);
        }, 1000);
      } else {
        setSyncStatus('failed');
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl">
              {record.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Modify Citizen Data</h2>
              <p className="text-sm text-slate-500 font-medium">Internal Record: <span className="text-slate-900">{record.name}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Sync Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              syncStatus === 'idle' ? 'bg-slate-100 text-slate-500' :
              syncStatus === 'syncing' ? 'bg-blue-100 text-blue-600 animate-pulse' :
              syncStatus === 'synced' ? 'bg-green-100 text-green-600' :
              'bg-red-100 text-red-600'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                syncStatus === 'idle' ? 'bg-slate-400' :
                syncStatus === 'syncing' ? 'bg-blue-500' :
                syncStatus === 'synced' ? 'bg-green-500' :
                'bg-red-500'
              }`}></div>
              {syncStatus === 'idle' && 'Ready to Sync'}
              {syncStatus === 'syncing' && 'Syncing with Headquarters...'}
              {syncStatus === 'synced' && 'Network Synchronized'}
              {syncStatus === 'failed' && 'Sync Failed - Retry'}
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
        </div>
        
        <div className="overflow-y-auto flex-1 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Section */}
            <div className="lg:col-span-8 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">Date of Birth</label>
                    <input 
                      type="date"
                      value={formData.dob}
                      onChange={e => setFormData({...formData, dob: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">Residential Address</label>
                  <textarea 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    rows={2}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">NIN (11 Digits)</label>
                    <input 
                      type="text"
                      value={formData.nin}
                      maxLength={11}
                      onChange={handleNinChange}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm font-mono font-bold tracking-wider focus:ring-4 outline-none transition-all ${isNinValid ? 'border-slate-300' : 'border-red-400'}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">Primary Phone</label>
                    <input 
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm font-mono font-bold tracking-wider focus:ring-4 outline-none transition-all ${isPhoneValid ? 'border-slate-300' : 'border-red-400'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">State of Origin</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 text-sm font-semibold">
                      {record.stateOfOrigin}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">LGA</label>
                    <select 
                      value={formData.lga}
                      onChange={e => setFormData({...formData, lga: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    >
                      {SOKOTO_LGAS.map(lga => <option key={lga} value={lga}>{lga}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">Justification Notes</label>
                  <textarea 
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Provide mandatory reason for modification..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/20 outline-none transition-all resize-none h-24"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isPhoneValid || !isNinValid || !isChanged || syncStatus === 'syncing'}
                  className={`w-full px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${
                    isPhoneValid && isNinValid && isChanged && syncStatus !== 'syncing'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {syncStatus === 'syncing' ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Validating with Central Server...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Commit Synchronized Update
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Section: Biometrics & Audit Info */}
            <div className="lg:col-span-4 space-y-8">
              {/* Biometric Capture */}
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Biometric Portrait</h3>
                  <div className="px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-black rounded uppercase">Live Feed Enabled</div>
                </div>
                
                <div className="aspect-square bg-slate-200 rounded-2xl overflow-hidden relative border-2 border-slate-300">
                  {showCamera ? (
                    <div className="w-full h-full relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute inset-0 border-[1.5px] border-white/30 rounded-full scale-[0.7]"></div>
                      <button 
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-slate-300 shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
                      >
                        <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      {capturedPhoto ? (
                        <img src={capturedPhoto} className="w-full h-full object-cover" alt="Captured citizen" />
                      ) : (
                        <div className="space-y-3">
                          <svg className="w-12 h-12 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Identity verification capture required</p>
                        </div>
                      )}
                      
                      {!showCamera && (
                        <button 
                          onClick={startCamera}
                          className="absolute inset-0 bg-black/0 hover:bg-black/5 flex items-center justify-center group transition-all"
                        >
                          <span className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                            {capturedPhoto ? 'Recapture Biometrics' : 'Start Camera Feed'}
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                <p className="text-[9px] text-slate-400 font-medium italic">Biometrics are hashed and encrypted before transmission to headquarters.</p>
              </div>

              {/* Internal Guidance Section */}
              <div className="bg-blue-50 rounded-3xl border border-blue-100 p-6 space-y-3">
                <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Compliance Tip
                </h3>
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  Ensure the citizen's residential address matches their physical utility bill. NIN modification requires physical presence of the card holder.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Audit History Log */}
          <div className="mt-12 pt-10 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-slate-200">
                H
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Modification Audit Trail</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Permanent Transaction Records</p>
              </div>
            </div>

            {record.modificationHistory.length > 0 ? (
              <div className="space-y-6">
                {record.modificationHistory.map((log) => (
                  <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-blue-200 transition-all group">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-black text-xs text-slate-600">
                          {log.agentName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{log.agentName}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">AGENT ID: {log.agentId}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] text-slate-900 font-black tracking-tighter">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black rounded uppercase">Signed & Hashed</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {log.newName && log.oldName !== log.newName && (
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Name Change</p>
                          <div className="flex items-center gap-2 text-[10px] font-medium">
                            <span className="text-slate-400 line-through">{log.oldName}</span>
                            <svg className="w-2.5 h-2.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                            <span className="text-blue-700 font-bold">{log.newName}</span>
                          </div>
                        </div>
                      )}
                      {log.newPhone && log.oldPhone !== log.newPhone && (
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Phone Sync</p>
                          <div className="flex items-center gap-2 text-[10px] font-medium font-mono">
                            <span className="text-slate-400 line-through">{log.oldPhone}</span>
                            <svg className="w-2.5 h-2.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                            <span className="text-blue-700 font-bold">{log.newPhone}</span>
                          </div>
                        </div>
                      )}
                      {log.newNin && log.oldNin !== log.newNin && (
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">NIN Revision</p>
                          <div className="flex items-center gap-2 text-[10px] font-medium font-mono">
                            <span className="text-slate-400 line-through">{log.oldNin}</span>
                            <svg className="w-2.5 h-2.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                            <span className="text-blue-700 font-bold">{log.newNin}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {log.notes && (
                      <div className="mt-4 p-3 bg-white rounded-xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Official Justification</p>
                        <p className="text-[10px] text-slate-600 font-medium italic">"{log.notes}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No existing transaction logs for this citizen</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModificationModal;
