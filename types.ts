
export enum RecordStatus {
  VERIFIED = 'Verified',
  PENDING = 'Pending',
  FLAGGED = 'Flagged',
  MODIFIED = 'Modified'
}

export interface ModificationLog {
  id: string;
  recordId: string;
  oldPhone: string;
  newPhone: string;
  oldLga?: string;
  newLga?: string;
  notes?: string;
  timestamp: string;
  agentId: string;
  agentName: string;
}

export interface NimcRecord {
  id: string;
  name: string;
  nin: string;
  phoneNumber: string;
  gender: 'Male' | 'Female';
  stateOfOrigin: string;
  localGovernmentArea: string;
  lastModified: string;
  status: RecordStatus;
  modificationHistory: ModificationLog[];
}