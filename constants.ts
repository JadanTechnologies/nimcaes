
import { NimcRecord, RecordStatus, ModificationLog } from './types';

const HAUSA_FIRST_NAMES = [
  'Musa', 'Sani', 'Fatima', 'Zainab', 'Amina', 'Ibrahim', 'Abubakar', 'Umar', 
  'Aisha', 'Hadiza', 'Bello', 'Usman', 'Salisu', 'Kabiru', 'Bashir', 'Maryam',
  'Aliyu', 'Hassan', 'Hussaini', 'Rukayya', 'Lauwali', 'Nura', 'Rabiu', 'Habibu'
];

const HAUSA_LAST_NAMES = [
  'Danjuma', 'Bako', 'Garba', 'Gwadabe', 'Yusuf', 'Abdullahi', 'Muhammed', 
  'Shehu', 'Tukur', 'Jibrin', 'Maina', 'Ladan', 'Buhari', 'Kwankwaso', 'Ribadu'
];

const generateNIN = () => Math.floor(10000000000 + Math.random() * 90000000000).toString();
const generatePhone = () => `+234${Math.floor(7000000000 + Math.random() * 3000000000)}`;

export const generateMockData = (count: number): NimcRecord[] => {
  const records: NimcRecord[] = [
    {
      id: '0',
      name: 'Lauwali Rukayyan',
      nin: '38820058810',
      phoneNumber: '+2348031234567',
      gender: 'Male',
      stateOfOrigin: 'Sokoto',
      localGovernmentArea: 'Rabah',
      lastModified: new Date().toISOString(),
      status: RecordStatus.PENDING,
      modificationHistory: []
    }
  ];

  for (let i = 1; i < count; i++) {
    const firstName = HAUSA_FIRST_NAMES[Math.floor(Math.random() * HAUSA_FIRST_NAMES.length)];
    const lastName = HAUSA_LAST_NAMES[Math.floor(Math.random() * HAUSA_LAST_NAMES.length)];
    const id = i.toString();
    
    // Randomly add some history to some records
    const history: ModificationLog[] = [];
    if (Math.random() > 0.8) {
      history.push({
        id: `hist-${id}-1`,
        recordId: id,
        oldPhone: generatePhone(),
        newPhone: generatePhone(),
        timestamp: new Date(Date.now() - 500000000).toISOString(),
        agentId: 'AGT-882',
        agentName: 'System Migration'
      });
    }

    records.push({
      id,
      name: `${lastName} ${firstName}`,
      nin: generateNIN(),
      phoneNumber: generatePhone(),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      stateOfOrigin: 'Sokoto',
      localGovernmentArea: 'Rabah',
      lastModified: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      status: [RecordStatus.VERIFIED, RecordStatus.PENDING, RecordStatus.FLAGGED][Math.floor(Math.random() * 3)],
      modificationHistory: history
    });
  }

  return records;
};
