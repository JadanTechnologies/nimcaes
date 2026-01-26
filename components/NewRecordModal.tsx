
import React, { useState, useMemo } from 'react';
import { NimcRecord, RecordStatus } from '../types';

interface NewRecordModalProps {
  onClose: () => void;
  onSave: (newRecord: Omit<NimcRecord, 'id' | 'lastModified' | 'status' | 'modificationHistory'>) => void;
}

const NewRecordModal: React.FC<NewRecordModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    nin: '',
    phoneNumber: '+234',
    gender: 'Male' as 'Male' | 'Female',
    stateOfOrigin: 'Sokoto',
    localGovernmentArea: 'Rabah'
  });

  const phoneRegex = /^\+234\d{10}$/;
  const ninRegex = /^\d{11}$/;

  const isPhoneValid = useMemo(() => phoneRegex.test(formData.phoneNumber), [formData.phoneNumber]);
  const isNinValid = useMemo(() => ninRegex.test(formData.nin), [formData.nin]);
  const isNameValid = formData.name.trim().length > 3;

  const canSubmit = isPhoneValid && isNinValid && isNameValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">New Modification Request</h2>
            <p className="text-sm text-slate-500">Submit a new entry for identity processing</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">State</label>
              <input type="text" value={formData.stateOfOrigin} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed text-sm" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">LGA</label>
              <input type="text" value={formData.localGovernmentArea} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name (Last Name First)</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Danjuma Musa"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Gender</label>
              <select 
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as 'Male' | 'Female'})}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">NIN (11 Digits)</label>
              <input 
                type="text" 
                maxLength={11}
                required
                placeholder="00000000000"
                value={formData.nin}
                onChange={e => setFormData({...formData, nin: e.target.value.replace(/\D/g, '')})}
                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 outline-none text-sm font-mono transition-all ${isNinValid ? 'border-green-500 focus:ring-green-500/20' : 'border-slate-300 focus:ring-blue-500/20'}`} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Primary Phone Number</label>
            <input 
              type="tel" 
              required
              maxLength={14}
              value={formData.phoneNumber}
              onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
              className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 outline-none text-sm font-mono transition-all ${isPhoneValid ? 'border-green-500 focus:ring-green-500/20' : 'border-slate-300 focus:ring-blue-500/20'}`} 
            />
            <p className="mt-1 text-[10px] text-slate-400">Format: +234 followed by 10 digits</p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all shadow-lg ${
                canSubmit 
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/20' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRecordModal;
