
import React, { useState, useEffect } from 'react';
import { NimcRecord, RecordStatus, ModificationLog } from './types';
import { generateMockData } from './constants';
import RecordTable from './components/RecordTable';
import ModificationModal from './components/ModificationModal';
import NewRecordModal from './components/NewRecordModal';
import LoginScreen from './components/LoginScreen';
import SecurityOverlay from './components/SecurityOverlay';
import { getAiGuidance } from './services/geminiService';

const App: React.FC = () => {
  // Authentication State
  const [authState, setAuthState] = useState<'unauthenticated' | 'authenticating' | 'success_popup' | 'lockout' | 'authenticated'>('unauthenticated');
  
  const [records, setRecords] = useState<NimcRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<NimcRecord | null>(null);
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const data = generateMockData(500);
    setRecords(data);
  }, []);

  const handleLoginSuccess = () => {
    setAuthState('success_popup');
    setTimeout(() => {
      setAuthState('lockout');
    }, 2000);
  };

  const handleUpdateRecord = (recordId: string, newPhone: string, newLga: string, notes: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        const newHistoryEntry: ModificationLog = {
          id: `hist-${Date.now()}`,
          recordId: rec.id,
          oldPhone: rec.phoneNumber,
          newPhone: newPhone,
          oldLga: rec.localGovernmentArea,
          newLga: newLga,
          notes: notes,
          timestamp: new Date().toISOString(),
          agentId: 'AGT-7742',
          agentName: 'Jabir'
        };

        return { 
          ...rec, 
          phoneNumber: newPhone, 
          localGovernmentArea: newLga,
          status: RecordStatus.MODIFIED, 
          lastModified: new Date().toISOString(),
          modificationHistory: [newHistoryEntry, ...rec.modificationHistory]
        };
      }
      return rec;
    }));
    setSelectedRecord(null);
  };

  const handleCreateNewRecord = (data: Omit<NimcRecord, 'id' | 'lastModified' | 'status' | 'modificationHistory'>) => {
    const newRecord: NimcRecord = {
      ...data,
      id: `new-${Date.now()}`,
      status: RecordStatus.PENDING,
      lastModified: new Date().toISOString(),
      modificationHistory: []
    };
    setRecords(prev => [newRecord, ...prev]);
    setIsNewRecordModalOpen(false);
  };

  const askAi = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    const response = await getAiGuidance(aiQuery, selectedRecord || records[0]);
    setAiResponse(response || 'No guidance available.');
    setIsAiLoading(false);
  };

  if (authState === 'unauthenticated') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {authState === 'success_popup' && <SecurityOverlay status="success" />}
      {authState === 'lockout' && <SecurityOverlay status="lockout" />}

      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-green-900/20">
              N
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">NIMC INTERNAL PORTAL</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">Identity Verification & Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Welcome back, Jabir</p>
              <p className="text-xs text-slate-400">Headquarters - Abuja</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 border border-slate-600 flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
              J
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <button 
            onClick={() => setIsNewRecordModalOpen(true)}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </button>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-wide">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Compliance AI Assistant
            </h3>
            <div className="space-y-4">
              <textarea 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask about modification rules..."
                className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-slate-50"
              />
              <button 
                onClick={askAi}
                disabled={isAiLoading}
                className="w-full py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {isAiLoading ? 'Analyzing...' : 'Get Guidance'}
              </button>
              
              {aiResponse && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-semibold text-blue-800 mb-1 uppercase tracking-tighter">AI Insight</p>
                  <p className="text-xs text-blue-900 leading-relaxed">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Database Records</h2>
              <p className="text-slate-500 text-sm">Citizen data synchronization status</p>
            </div>
            <div className="relative w-full sm:w-72">
              <input 
                type="text" 
                placeholder="Search NIN or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <RecordTable 
            records={records} 
            onSelect={setSelectedRecord} 
            searchTerm={searchTerm}
          />
        </div>
      </main>

      {selectedRecord && (
        <ModificationModal 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)}
          onSave={handleUpdateRecord}
        />
      )}

      {isNewRecordModalOpen && (
        <NewRecordModal 
          onClose={() => setIsNewRecordModalOpen(false)}
          onSave={handleCreateNewRecord}
        />
      )}
    </div>
  );
};

export default App;