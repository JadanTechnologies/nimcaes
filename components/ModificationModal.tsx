
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { NimcRecord } from '../types.ts';

interface ModificationModalProps {
  record: NimcRecord;
  onClose: () => void;
  onSave: (recordId: string, updates: Partial<NimcRecord>, notes: string, photo?: string) => void;
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 
  'Taraba', 'Yobe', 'Zamfara'
];

const SOKOTO_LGAS = [
  'Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 
  'Gwadabawa', 'Illela', 'Isa', 'Kware', 'Rabah', 'Sabon Birni', 
  'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 'Tambuwal', 
  'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'
];

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'failed';

const ModificationModal: React.FC<ModificationModalProps> = ({ record, onClose, onSave }) => {
  // Form State - Pre-filled with record data or defaults as requested
  const [formData, setFormData] = useState({
    name: record.name,
    nin: record.nin,
    phoneNumber: record.phoneNumber,
    state: record.stateOfOrigin || 'Sokoto',
    lga: record.localGovernmentArea || 'Rabah',
    address: record.address,
    dob: record.dateOfBirth,
  });
  const [notes, setNotes] = useState('');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [trackingId, setTrackingId] = useState<string | null>(null);
  
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
      formData.state !== record.stateOfOrigin ||
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

  const handleNinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, nin: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, phoneNumber: e.target.value }));
  };

  const triggerSave = () => {
    onSave(record.id, {
      name: formData.name,
      nin: formData.nin,
      phoneNumber: formData.phoneNumber,
      stateOfOrigin: formData.state,
      localGovernmentArea: formData.lga,
      address: formData.address,
      dateOfBirth: formData.dob,
      photo: capturedPhoto || undefined
    }, notes, capturedPhoto || undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid || !isNinValid || !isChanged) return;

    setSyncStatus('syncing');
    
    // Simulate server sync
    setTimeout(() => {
      const success = Math.random() > 0.05; // 95% success rate simulation
      if (success) {
        // Generate a persistent tracking ID for this session
        const newId = `NIMC-MOD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        setTrackingId(newId);
        setSyncStatus('synced');
        
        // Auto-close redirection logic
        setTimeout(() => {
           setSyncStatus(current => {
             if (current === 'synced') triggerSave();
             return current;
           });
        }, 5000);
      } else {
        setSyncStatus('failed');
      }
    }, 2000);
  };

  // Success Confirmation Screen Component
  if (syncStatus === 'synced') {
    return (
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xl flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
          <div className="p-12 flex flex-col items-center text-center">
            {/* Animated Success Icon */}
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 scale-150"></div>
              <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse opacity-50 scale-125"></div>
              <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 relative z-10 animate-in bounce-in duration-700">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="space-y-3 mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Modification Complete</h2>
              <p className="text-slate-500 font-medium max-w-xs mx-auto">
                Citizen record for <span className="text-slate-900 font-bold">{formData.name}</span> has been updated and synchronized with the NIMC Central Database.
              </p>
            </div>

            {/* Verification Card */}
            <div className="w-full bg-slate-950 rounded-3xl p-6 shadow-inner mb-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>
              </div>
              <div className="flex flex-col items-start gap-1 relative z-10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Verification Tracking ID</span>
                <div className="flex items-center gap-3 w-full justify-between">
                  <span className="text-xl font-mono font-bold text-green-400 selection:bg-green-500 selection:text-white">
                    {trackingId}
                  </span>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full space-y-4">
              <button 
                onClick={triggerSave}
                className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-3"
              >
                Return to Dashboard
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              {/* Countdown Progress Bar */}
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500/50 animate-[progress_5s_linear_forwards]"></div>
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Automatic Redirect Active</p>
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}} />
      </div>
    );
  }

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
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">State of Origin</label>
                    <select 
                      value={formData.state}
                      onChange={e => setFormData({...formData, state: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    >
                      {NIGERIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">LGA</label>
                    <select 
                      value={formData.lga}
                      onChange={e => setFormData({...formData, lga: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                    >
                      {SOKOTO_LGAS.map(lga => <option key={lga} value={lga}>{lga}</option>)}
                      {/* Optional: Add logic to filter LGAs based on State if needed for production use */}
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
