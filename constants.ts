
import { NimcRecord, RecordStatus, ModificationLog } from './types.ts';

const HAUSA_FIRST_NAMES = [
  'Musa', 'Sani', 'Fatima', 'Zainab', 'Amina', 'Ibrahim', 'Abubakar', 'Umar', 
  'Aisha', 'Hadiza', 'Bello', 'Usman', 'Salisu', 'Kabiru', 'Bashir', 'Maryam',
  'Aliyu', 'Hassan', 'Hussaini', 'Rukayya', 'Lauwali', 'Nura', 'Rabiu', 'Habibu',
  'Mustapha', 'Umaru', 'Nasiru', 'Mansur', 'Shuaibu', 'Zahra'
];

const HAUSA_LAST_NAMES = [
  'Danjuma', 'Bako', 'Garba', 'Gwadabe', 'Yusuf', 'Abdullahi', 'Muhammed', 
  'Shehu', 'Tukur', 'Jibrin', 'Maina', 'Ladan', 'Buhari', 'Kwankwaso', 'Ribadu',
  'Sarki', 'Zaki', 'Kano', 'Zaria', 'Sokoto', 'Gwandu', 'Dutse'
];

const LGAS = ['Rabah', 'Sokoto North', 'Wamako', 'Dala', 'Gwadabawa', 'Illela'];

const generateNIN = () => Math.floor(10000000000 + Math.random() * 90000000000).toString();
const generatePhone = () => `+234${Math.floor(7000000000 + Math.random() * 3000000000)}`;
const generateAddress = () => `${Math.floor(Math.random() * 100)} Market Road, ${LGAS[Math.floor(Math.random() * LGAS.length)]}`;
const generateDOB = () => {
  const start = new Date(1960, 0, 1);
  const end = new Date(2005, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

export const generateMockData = (count: number): NimcRecord[] => {
  const records: NimcRecord[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = HAUSA_FIRST_NAMES[Math.floor(Math.random() * HAUSA_FIRST_NAMES.length)];
    const lastName = HAUSA_LAST_NAMES[Math.floor(Math.random() * HAUSA_LAST_NAMES.length)];
    const id = `rec-${i}-${Math.floor(Math.random() * 1000)}`;
    const lga = LGAS[Math.floor(Math.random() * LGAS.length)];
    
    records.push({
      id,
      name: `${lastName} ${firstName}`,
      nin: generateNIN(),
      phoneNumber: generatePhone(),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      stateOfOrigin: 'Sokoto',
      localGovernmentArea: lga,
      address: generateAddress(),
      dateOfBirth: generateDOB(),
      lastModified: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      status: [RecordStatus.VERIFIED, RecordStatus.PENDING, RecordStatus.FLAGGED][Math.floor(Math.random() * 3)],
      modificationHistory: []
    });
  }

  return records;
};