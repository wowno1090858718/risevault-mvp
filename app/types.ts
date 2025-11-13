export type RecordStatus = 'pending' | 'verified';

export interface WorkRecord {
  id: string;
  project: string;
  text: string;
  createdAt: Date;
  status: RecordStatus;
  verifiedAt?: Date;
}

