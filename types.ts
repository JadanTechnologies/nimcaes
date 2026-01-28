
export enum RecordStatus {
  VERIFIED = 'Verified',
  PENDING = 'Pending',
  FLAGGED = 'Flagged',
  MODIFIED = 'Modified'
}

export interface ModificationLog {
  id: string;
  recordId: string;
  oldPhone?: string;
  newPhone?: string;
  oldLga?: string;
  newLga?: string;
  oldNin?: string;
  newNin?: string;
  oldName?: string;
  newName?: string;
  oldAddress?: string;
  newAddress?: string;
  oldDob?: string;
  newDob?: string;
  photoCaptured?: string; // base64
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
  address: string;
  dateOfBirth: string;
  photo?: string;
  lastModified: string;
  status: RecordStatus;
  modificationHistory: ModificationLog[];
}