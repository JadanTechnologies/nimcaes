
import React from 'react';
import { NimcRecord, RecordStatus } from '../types';

interface RecordTableProps {
  records: NimcRecord[];
  onSelect: (record: NimcRecord) => void;
  searchTerm: string;
}

const RecordTable: React.FC<RecordTableProps> = ({ records, onSelect, searchTerm }) => {
  const filtered = records.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.nin.includes(searchTerm) ||
    r.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">NIN</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Phone Number</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Location (LGA)</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filtered.map((record) => (
            <tr key={record.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{record.name}</td>
              <td className="px-6 py-4 text-sm text-slate-500 font-mono">{record.nin}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{record.phoneNumber}</td>
              <td className="px-6 py-4 text-sm text-slate-500">
                {record.stateOfOrigin}, {record.localGovernmentArea}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  record.status === RecordStatus.VERIFIED ? 'bg-green-100 text-green-700' :
                  record.status === RecordStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                  record.status === RecordStatus.FLAGGED ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {record.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => onSelect(record)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                >
                  Modify
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                No matching records found in the database.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecordTable;
